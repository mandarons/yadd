import { describe, it, expect } from 'bun:test';
import { serviceSchema } from './zod-schemas';

describe('Service Schema Validation', () => {
	describe('Valid inputs', () => {
		it('should accept valid service data', () => {
			const validData = {
				name: 'Google',
				shortName: 'google',
				url: 'https://google.com',
				logoUrl: 'https://google.com/favicon.ico'
			};

			const result = serviceSchema.safeParse(validData);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(validData);
			}
		});

		it('should accept shortName with hyphens', () => {
			const validData = {
				name: 'My Service',
				shortName: 'my-service-123',
				url: 'https://example.com',
				logoUrl: 'https://example.com/logo.png'
			};

			const result = serviceSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should accept maximum length name', () => {
			const validData = {
				name: 'a'.repeat(100),
				shortName: 'test',
				url: 'https://example.com',
				logoUrl: 'https://example.com/logo.png'
			};

			const result = serviceSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});
	});

	describe('Invalid inputs', () => {
		it('should reject empty name', () => {
			const invalidData = {
				name: '',
				shortName: 'test',
				url: 'https://test.com',
				logoUrl: 'https://test.com/logo.png'
			};

			const result = serviceSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain('Service name is required');
			}
		});

		it('should reject empty shortName', () => {
			const invalidData = {
				name: 'Test',
				shortName: '',
				url: 'https://test.com',
				logoUrl: 'https://test.com/logo.png'
			};

			const result = serviceSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it('should reject invalid URL', () => {
			const invalidData = {
				name: 'Test',
				shortName: 'test',
				url: 'not-a-url',
				logoUrl: 'https://test.com/logo.png'
			};

			const result = serviceSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain('valid URL');
			}
		});

		it('should reject invalid logoUrl', () => {
			const invalidData = {
				name: 'Test',
				shortName: 'test',
				url: 'https://test.com',
				logoUrl: 'not-a-url'
			};

			const result = serviceSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain('valid logo URL');
			}
		});

		it('should reject shortName with uppercase letters', () => {
			const invalidData = {
				name: 'Test',
				shortName: 'TestService',
				url: 'https://test.com',
				logoUrl: 'https://test.com/logo.png'
			};

			const result = serviceSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain('lowercase');
			}
		});

		it('should reject shortName with special characters', () => {
			const invalidData = {
				name: 'Test',
				shortName: 'test_service!',
				url: 'https://test.com',
				logoUrl: 'https://test.com/logo.png'
			};

			const result = serviceSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it('should reject name longer than 100 characters', () => {
			const invalidData = {
				name: 'a'.repeat(101),
				shortName: 'test',
				url: 'https://test.com',
				logoUrl: 'https://test.com/logo.png'
			};

			const result = serviceSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain('less than 100');
			}
		});

		it('should reject shortName longer than 50 characters', () => {
			const invalidData = {
				name: 'Test',
				shortName: 'a'.repeat(51),
				url: 'https://test.com',
				logoUrl: 'https://test.com/logo.png'
			};

			const result = serviceSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain('less than 50');
			}
		});

		it('should reject missing required fields', () => {
			const invalidData = {};

			const result = serviceSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues.length).toBeGreaterThan(0);
			}
		});
	});
});
