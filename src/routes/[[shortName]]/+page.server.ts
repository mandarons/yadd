import { fail, type Actions, redirect, error } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { serviceSchema } from '$lib/config/zod-schemas';
import type { PageServerLoad } from './$types';
import { setError, superValidate } from 'sveltekit-superforms/server';

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(event, serviceSchema);
	if (event.params.shortName) {
		const service = await prisma.service.findUnique({
			where: { shortName: event.params.shortName }
		});
		if (service) throw redirect(301, service.url);
		// TODO: redirect to / with service not found message.
		else throw error(404, { message: 'Service not found' });
	}
	const services = await prisma.service.findMany();
	return { form, services };
};

export const actions: Actions = {
	createService: async (event) => {
		const form = await superValidate(event.request, serviceSchema);
		if (!form.valid) return fail(400, { form });
		try {
			await prisma.service.create({
				data: form.data
			});
		} catch (error) {
			console.error(error);
			setError(form, 'shortName', 'Service short name must be unique');
			return fail(500, { form });
		}
		return { form };
	},
	updateService: async (event) => {
		const form = await superValidate(event.request, serviceSchema);
		if (!form.valid) return fail(400, { form });
		try {
			await prisma.service.update({
				where: { shortName: form.data.shortName },
				data: form.data
			});
		} catch (error) {
			console.error(error);
			return fail(500, { form });
		}
		return { form };
	},
	deleteService: async (event) => {
		const form = await superValidate(event.request, serviceSchema);
		if (!form.valid) return fail(400, { form });
		await prisma.service.delete({
			where: { shortName: form.data.shortName }
		});
		return { form };
	}
};
