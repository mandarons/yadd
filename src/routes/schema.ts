import { z } from 'zod';

const schema = z.object({
	name: z.string(),
	shortName: z.string(),
	url: z.string().url(),
	logoUrl: z.string().url()
});

export default schema;
