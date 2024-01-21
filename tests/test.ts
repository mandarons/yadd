import prisma from '../src/lib/prisma';
// import { expect, test } from '@playwright/test';
import { expect, test } from './baseFixtures.js';

test.beforeEach('Cleanup database', async () => {
	const services = await prisma.service.findMany();
	if (services.length === 0) return;
	services.map(async (service) => {
		await prisma.service.delete({ where: { shortName: service.shortName } });
	});
});
test.afterEach(async () => {
	const services = await prisma.service.findMany();
	if (services.length === 0) return;
	services.map(async (service) => {
		await prisma.service.delete({ where: { shortName: service.shortName } });
	});
});

//Write test for index page to check if dark mode button works
test('index page has dark mode button and it works', async ({ page }) => {
	await page.goto('/');
	const currentTheme = await (await page.locator('html').elementHandle())?.getAttribute('class');
	await expect(page.getByTitle('Toggle light or dark mode.')).toBeVisible();
	await page.click('div[title="Toggle light or dark mode."]');
	// get class of html element
	const newTheme = await (await page.locator('html').elementHandle())?.getAttribute('class');
	expect(currentTheme).not.toEqual(newTheme);
});

// Write a test for adding new service
test('add new service', async ({ page }) => {
	await page.goto('/');
	await page.click('text=Add a new service');
	await page.fill('input[name="name"]', 'Google');
	await page.fill('input[name="shortName"]', 'google');
	await page.fill('input[name="url"]', 'https://google.com');
	await page.fill('input[name="logoUrl"]', 'https://google.com/favicon.ico');
	await page.click('button[type="submit"]');
	await expect(page.locator('#linkgoogle')).toBeVisible();
});

test('update service', async ({ page }) => {
	await page.goto('/');
	await page.click('text=Add a new service');
	await page.fill('input[name="name"]', 'Yahoo');
	await page.fill('input[name="shortName"]', 'yahoo');
	await page.fill('input[name="url"]', 'https://yahoo.com');
	await page.fill('input[name="logoUrl"]', 'https://yahoo.com/favicon.ico');
	await page.click('button[type="submit"]');
	await page.reload();
	await expect(page.locator('#linkyahoo')).toBeVisible();
	await page.click('#btnUpdateyahoo');
	await page.fill('input[name="name"]', 'Yahoo!');
	await page.click('#btnUpdateService');
	// wait for text to be updated
	await page.reload();
	//Get value of id textyahooName and check if it is equal to Yahoo!
	const updatedName = await page.locator('#textyahooName').innerText();
	expect(updatedName).toEqual('Yahoo!');
});

test('delete service', async ({ page }) => {
	await page.goto('/');
	await page.click('text=Add a new service');
	await page.fill('input[name="name"]', 'Bing');
	await page.fill('input[name="shortName"]', 'bing');
	await page.fill('input[name="url"]', 'https://bing.com');
	await page.fill('input[name="logoUrl"]', 'https://bing.com/favicon.ico');
	await page.click('button[type="submit"]');
	await expect(page.locator('#linkbing')).toBeVisible();
	await page.click('#btnUpdatebing');
	await page.click('#btnDeleteService');
	// wait for text to be updated
	await page.reload();
	await expect(page.locator('#linkbing')).not.toBeVisible();
});

test('navigate to url on clicking service', async ({ page }) => {
	await page.goto('/');
	await page.click('text=Add a new service');
	await page.fill('input[name="name"]', 'DuckDuckGo');
	await page.fill('input[name="shortName"]', 'duckduckgo');
	await page.fill('input[name="url"]', 'https://duckduckgo.com');
	await page.fill('input[name="logoUrl"]', 'https://duckduckgo.com/favicon.ico');
	await page.click('button[type="submit"]');
	await page.reload();
	await expect(page.locator('#linkduckduckgo')).toBeVisible();
	const popupPromise = page.waitForEvent('popup');
	await page.click('#linkduckduckgo');
	const popup = await popupPromise;
	await popup.waitForLoadState();
	expect(popup.url()).toContain('https://duckduckgo.com');
});
