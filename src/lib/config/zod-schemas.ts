import { z } from 'zod';
export const serviceSchema = z.object({
	name: z
		.string({ required_error: 'Service name is required' })
		.min(1, { message: 'Service name is required' })
		.trim(),
	shortName: z
		.string({ required_error: 'Service short name is required' })
		.min(1, { message: 'Service short name is required' })
		.trim(),
	url: z
		.string({ required_error: 'Service URL is required' })
		.url({ message: 'Service URL is required' })
		.trim(),
	logoUrl: z
		.string({ required_error: 'Service logo URL is required' })
		.url({ message: 'Service logo URL is required' })
		.trim()
});

export type ServiceSchema = z.infer<typeof serviceSchema>;
export type ServiceDB = z.infer<typeof serviceSchema>[];
const g = globalThis as unknown as { services: ServiceDB };
export const services: ServiceDB = (g.services = g.services || [
	{
		name: 'Google',
		shortName: 'google',
		url: 'https://google.com',
		logoUrl: 'https://google.com/favicon.ico'
	},
	{
		name: 'Facebook',
		shortName: 'facebook',
		url: 'https://facebook.com',
		logoUrl: 'https://facebook.com/favicon.ico'
	},
	{
		name: 'Twitter',
		shortName: 'twitter',
		url: 'https://twitter.com',
		logoUrl: 'https://twitter.com/favicon.ico'
	},
	{
		name: 'Instagram',
		shortName: 'instagram',
		url: 'https://instagram.com',
		logoUrl: 'https://instagram.com/favicon.ico'
	},
	{
		name: 'LinkedIn',
		shortName: 'linkedin',
		url: 'https://linkedin.com',
		logoUrl: 'https://linkedin.com/favicon.ico'
	},
	{
		name: 'Snapchat',
		shortName: 'snapchat',
		url: 'https://snapchat.com',
		logoUrl: 'https://snapchat.com/favicon.ico'
	},
	{
		name: 'TikTok',
		shortName: 'tiktok',
		url: 'https://tiktok.com',
		logoUrl: 'https://tiktok.com/favicon.ico'
	}
]);
