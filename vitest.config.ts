import { defineConfig } from 'vitest/config';
import path from 'path';
export default defineConfig({
	// report coverage as html
	test: {
		coverage: {
			provider: 'v8',
			enabled: true,
			reporter: ['html', 'text-summary'],
			include: ['src/**/*.ts']
		},
		reporters: ['default', 'html']
	},
	resolve: {
		alias: {
			$lib: path.resolve(__dirname, './src/lib')
		}
	}
});
