import { serviceSchema } from '$lib/config/zod-schemas';
import type { LayoutServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';

export const load: LayoutServerLoad = async (event) => {
	const form = await superValidate(event, serviceSchema);
	return { form };
};
