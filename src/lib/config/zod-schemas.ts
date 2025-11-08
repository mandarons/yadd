import { z } from 'zod';

/**
 * Schema for service validation with comprehensive error messages
 */
export const serviceSchema = z.object({
	name: z
		.string({ required_error: 'Service name is required' })
		.min(1, { message: 'Service name is required' })
		.max(100, { message: 'Service name must be less than 100 characters' })
		.trim(),
	shortName: z
		.string({ required_error: 'Service short name is required' })
		.min(1, { message: 'Service short name is required' })
		.max(50, { message: 'Service short name must be less than 50 characters' })
		.regex(/^[a-z0-9-]+$/, {
			message: 'Short name must contain only lowercase letters, numbers, and hyphens'
		})
		.trim(),
	url: z
		.string({ required_error: 'Service URL is required' })
		.url({ message: 'Please enter a valid URL' })
		.trim(),
	logoUrl: z
		.string({ required_error: 'Service logo URL is required' })
		.url({ message: 'Please enter a valid logo URL' })
		.trim()
});

export type ServiceSchema = z.infer<typeof serviceSchema>;
export type ServiceDB = z.infer<typeof serviceSchema>[];
