import { fail, type Actions } from '@sveltejs/kit';

import { serviceSchema, services } from '$lib/config/zod-schemas';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(event, serviceSchema);
	return { form, services };
};

export const actions: Actions = {
	createService: async (event) => {
		const form = await superValidate(event.request, serviceSchema);
		if (!form.valid) return fail(400, { form });
		return { form };
	},
	updateService: async (event) => {
		const form = await superValidate(event.request, serviceSchema);
		if (!form.valid) return fail(400, { form });
		return { form };
	},
	deleteService: async (event) => {
		const form = await superValidate(event.request, serviceSchema);
		if (!form.valid) return fail(400, { form });
		return { form };
	}
};
