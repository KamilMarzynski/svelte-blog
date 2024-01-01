import { join } from 'path';
import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

// 1. Import the Skeleton plugin
import { skeleton } from '@skeletonlabs/tw-plugin';
import { myCustomTheme } from './my-custom-theme';

const config = {
	// 2. Opt for dark mode to be handled via the class method
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		// 3. Append the path to the Skeleton package
		join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
	],
	theme: {
		extend: {
			spacing: {
				'128': '32rem',
				'144': '36rem',
				'160': '40rem',
				'176': '44rem',
				'192': '48rem',
				'208': '52rem',
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: '100ch', // add required value here
					  },
				}
			}
		},
	},
	plugins: [
		forms,
		require('@tailwindcss/typography'),
		skeleton({
			themes: {
				custom: [
					myCustomTheme,
				],
				// preset: [
				// 	{
				// 		name: 'skeleton',
				// 		enhancements: true,
				// 	},
				// ],
			},
		}),
	],
} satisfies Config;

export default config;