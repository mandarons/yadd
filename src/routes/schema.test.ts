import { describe, it, expect } from 'vitest';
import schema from './schema';

describe('Route Schema', () => {
	it('should validate valid service data', () => {
		const validData = {
			name: 'Test Service',
			shortName: 'test',
			url: 'https://test.com',
			logoUrl: 'https://test.com/logo.png'
		};

		const result = schema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it('should reject invalid URL', () => {
		const invalidData = {
			name: 'Test',
			shortName: 'test',
			url: 'invalid-url',
			logoUrl: 'https://test.com/logo.png'
		};

		const result = schema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it('should reject invalid logoUrl', () => {
		const invalidData = {
			name: 'Test',
			shortName: 'test',
			url: 'https://test.com',
			logoUrl: 'invalid-url'
		};

		const result = schema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});
});
