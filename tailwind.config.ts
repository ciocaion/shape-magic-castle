import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
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
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Castle Theme Colors
				castle: {
					stone: 'hsl(var(--castle-stone))',
					tower: 'hsl(var(--castle-tower))',
					roof: 'hsl(var(--castle-roof))',
					door: 'hsl(var(--castle-door))',
					window: 'hsl(var(--castle-window))'
				},
				// Shape Colors
				shape: {
					square: 'hsl(var(--shape-square))',
					circle: 'hsl(var(--shape-circle))',
					triangle: 'hsl(var(--shape-triangle))',
					rectangle: 'hsl(var(--shape-rectangle))',
					star: 'hsl(var(--shape-star))',
					heart: 'hsl(var(--shape-heart))'
				},
				// Feedback Colors
				success: 'hsl(var(--success))',
				'success-foreground': 'hsl(var(--success-foreground))',
				error: 'hsl(var(--error))',
				'error-foreground': 'hsl(var(--error-foreground))'
			},
			// Magical Gradients
			backgroundImage: {
				'gradient-magic': 'var(--gradient-magic)',
				'gradient-castle': 'var(--gradient-castle)',
				'gradient-success': 'var(--gradient-success)',
				'gradient-glow': 'var(--gradient-glow)'
			},
			// Magical Box Shadows
			boxShadow: {
				'magic': 'var(--shadow-magic)',
				'castle': 'var(--shadow-castle)',
				'shape': 'var(--shadow-shape)',
				'glow': 'var(--shadow-glow)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				// Magical Game Animations
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'glow-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 20px hsl(280 90% 75% / 0.4)',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 0 40px hsl(280 90% 75% / 0.8)',
						transform: 'scale(1.05)'
					}
				},
				'sparkle': {
					'0%': { opacity: '0', transform: 'scale(0) rotate(0deg)' },
					'50%': { opacity: '1', transform: 'scale(1) rotate(180deg)' },
					'100%': { opacity: '0', transform: 'scale(0) rotate(360deg)' }
				},
				'bounce-in': {
					'0%': { transform: 'scale(0)', opacity: '0' },
					'50%': { transform: 'scale(1.1)', opacity: '0.8' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'shake': {
					'0%, 100%': { transform: 'translateX(0)' },
					'25%': { transform: 'translateX(-5px)' },
					'75%': { transform: 'translateX(5px)' }
				},
				'transform-3d': {
					'0%': { 
						transform: 'perspective(200px) rotateX(0deg) rotateY(0deg)',
						filter: 'brightness(1)'
					},
					'50%': { 
						transform: 'perspective(200px) rotateX(10deg) rotateY(10deg) scale(1.1)',
						filter: 'brightness(1.2)'
					},
					'100%': { 
						transform: 'perspective(200px) rotateX(5deg) rotateY(5deg)',
						filter: 'brightness(1.1)'
					}
				},
				'celebration': {
					'0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
					'25%': { transform: 'scale(1.2) rotate(90deg)', opacity: '0.8' },
					'50%': { transform: 'scale(1.1) rotate(180deg)', opacity: '0.9' },
					'75%': { transform: 'scale(1.3) rotate(270deg)', opacity: '0.7' },
					'100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				// Magical Game Animations
				'float': 'float 3s ease-in-out infinite',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'sparkle': 'sparkle 1s ease-in-out',
				'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'shake': 'shake 0.5s ease-in-out',
				'transform-3d': 'transform-3d 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
				'celebration': 'celebration 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
