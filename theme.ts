import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const yaddTheme: CustomThemeConfig = {
	name: 'yadd-theme',
	properties: {
		// =~= Theme Properties =~=
		'--theme-font-family-base': `system-ui`,
		'--theme-font-family-heading': `system-ui`,
		'--theme-font-color-base': '0 0 0',
		'--theme-font-color-dark': '255 255 255',
		'--theme-rounded-base': '16px',
		'--theme-rounded-container': '16px',
		'--theme-border-base': '1px',
		// =~= Theme On-X Colors =~=
		'--on-primary': '255 255 255',
		'--on-secondary': 'var(--color-primary-500)',
		'--on-tertiary': '255 255 255',
		'--on-success': '0 0 0',
		'--on-warning': '0 0 0',
		'--on-error': '255 255 255',
		'--on-surface': '255 255 255',
		// =~= Theme Colors  =~=
		// primary | #a6175e
		'--color-primary-50': '242 220 231', // #f2dce7
		'--color-primary-100': '237 209 223', // #edd1df
		'--color-primary-200': '233 197 215', // #e9c5d7
		'--color-primary-300': '219 162 191', // #dba2bf
		'--color-primary-400': '193 93 142', // #c15d8e
		'--color-primary-500': '166 23 94', // #a6175e
		'--color-primary-600': '149 21 85', // #951555
		'--color-primary-700': '125 17 71', // #7d1147
		'--color-primary-800': '100 14 56', // #640e38
		'--color-primary-900': '81 11 46', // #510b2e
		// secondary | #ffffff
		'--color-secondary-50': '255 255 255', // #ffffff
		'--color-secondary-100': '255 255 255', // #ffffff
		'--color-secondary-200': '255 255 255', // #ffffff
		'--color-secondary-300': '255 255 255', // #ffffff
		'--color-secondary-400': '255 255 255', // #ffffff
		'--color-secondary-500': '255 255 255', // #ffffff
		'--color-secondary-600': '230 230 230', // #e6e6e6
		'--color-secondary-700': '191 191 191', // #bfbfbf
		'--color-secondary-800': '153 153 153', // #999999
		'--color-secondary-900': '125 125 125', // #7d7d7d
		// tertiary | #545454
		'--color-tertiary-50': '229 229 229', // #e5e5e5
		'--color-tertiary-100': '221 221 221', // #dddddd
		'--color-tertiary-200': '212 212 212', // #d4d4d4
		'--color-tertiary-300': '187 187 187', // #bbbbbb
		'--color-tertiary-400': '135 135 135', // #878787
		'--color-tertiary-500': '84 84 84', // #545454
		'--color-tertiary-600': '76 76 76', // #4c4c4c
		'--color-tertiary-700': '63 63 63', // #3f3f3f
		'--color-tertiary-800': '50 50 50', // #323232
		'--color-tertiary-900': '41 41 41', // #292929
		// success | #55b460
		'--color-success-50': '230 244 231', // #e6f4e7
		'--color-success-100': '221 240 223', // #ddf0df
		'--color-success-200': '213 236 215', // #d5ecd7
		'--color-success-300': '187 225 191', // #bbe1bf
		'--color-success-400': '136 203 144', // #88cb90
		'--color-success-500': '85 180 96', // #55b460
		'--color-success-600': '77 162 86', // #4da256
		'--color-success-700': '64 135 72', // #408748
		'--color-success-800': '51 108 58', // #336c3a
		'--color-success-900': '42 88 47', // #2a582f
		// warning | #c58b26
		'--color-warning-50': '246 238 222', // #f6eede
		'--color-warning-100': '243 232 212', // #f3e8d4
		'--color-warning-200': '241 226 201', // #f1e2c9
		'--color-warning-300': '232 209 168', // #e8d1a8
		'--color-warning-400': '214 174 103', // #d6ae67
		'--color-warning-500': '197 139 38', // #c58b26
		'--color-warning-600': '177 125 34', // #b17d22
		'--color-warning-700': '148 104 29', // #94681d
		'--color-warning-800': '118 83 23', // #765317
		'--color-warning-900': '97 68 19', // #614413
		// error | #a13030
		'--color-error-50': '241 224 224', // #f1e0e0
		'--color-error-100': '236 214 214', // #ecd6d6
		'--color-error-200': '232 203 203', // #e8cbcb
		'--color-error-300': '217 172 172', // #d9acac
		'--color-error-400': '189 110 110', // #bd6e6e
		'--color-error-500': '161 48 48', // #a13030
		'--color-error-600': '145 43 43', // #912b2b
		'--color-error-700': '121 36 36', // #792424
		'--color-error-800': '97 29 29', // #611d1d
		'--color-error-900': '79 24 24', // #4f1818
		// surface | #313031
		'--color-surface-50': '224 224 224', // #e0e0e0
		'--color-surface-100': '214 214 214', // #d6d6d6
		'--color-surface-200': '204 203 204', // #cccbcc
		'--color-surface-300': '173 172 173', // #adacad
		'--color-surface-400': '111 110 111', // #6f6e6f
		'--color-surface-500': '49 48 49', // #313031
		'--color-surface-600': '44 43 44', // #2c2b2c
		'--color-surface-700': '37 36 37', // #252425
		'--color-surface-800': '29 29 29', // #1d1d1d
		'--color-surface-900': '24 24 24' // #181818
	}
};
