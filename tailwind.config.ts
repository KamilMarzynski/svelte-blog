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
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
				  DEFAULT: 'hsl(var(--primary))',
				  foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
				  DEFAULT: 'hsl(var(--secondary))',
				  foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
				  DEFAULT: 'hsl(var(--destructive))',
				  foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
				  DEFAULT: 'hsl(var(--muted))',
				  foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
				  DEFAULT: 'hsl(var(--accent))',
				  foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
				  DEFAULT: 'hsl(var(--popover))',
				  foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
				  DEFAULT: 'hsl(var(--card))',
				  foreground: 'hsl(var(--card-foreground))'
				}
			  },
			  borderRadius: {
				lg: `var(--radius)`,
				md: `calc(var(--radius) - 2px)`,
				sm: 'calc(var(--radius) - 4px)'
			  },
			  keyframes: {
				'accordion-down': {
				  from: {height: '0'},
				  to: {height: 'var(--radix-accordion-content-height)'}
				},
				'accordion-up': {
				  from: {height: 'var(--radix-accordion-content-height)'},
				  to: {height: '0'}
				}
			  },
			  animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			  },
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
				preset: [
					'skeleton',
				],
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