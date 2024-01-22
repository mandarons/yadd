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
