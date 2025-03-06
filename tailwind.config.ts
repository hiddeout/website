import type { Config } from "tailwindcss"

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}"
	],
	theme: {
    	extend: {
    		colors: {
    			stmp: {
    				'100': '#141114',
    				'200': '#111212',
    				'300': '#1F2020',
    				'400': '#161717',
    				'500': '#1B1C1C',
    				'600': '#111212',
    				'700': '#333434',
    				'900': '#161717',
    				unselected: '#A2A2A2',
    				main: '#94A8AE',
    				border: '#0f0f0e',
    				'card-border': '#232424',
    				secondary: '#919191',
    				dim: '#1c1c1c',
    				discord: '#5968de'
    			}
    		},
    		animation: {
    			glow: 'glow 1.5s ease-in-out infinite',
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'spin-slow': 'spin 3s linear infinite',
    			'shiny-text': 'shiny-text 8s infinite'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			pulse: {
    				'0%, 100%': {
    					opacity: '1'
    				},
    				'50%': {
    					opacity: '0.5'
    				}
    			},
    			'shiny-text': {
    				'0%, 90%, 100%': {
    					'background-position': 'calc(-100% - var(--shiny-width)) 0'
    				},
    				'30%, 60%': {
    					'background-position': 'calc(100% + var(--shiny-width)) 0'
    				}
    			}
    		}
    	}
    },
	plugins: []
}
export default config
