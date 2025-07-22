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
				'gradient-castle': 'var(--gradient-castle)',
				'gradient-success': 'var(--gradient-success)'
			},
			// GradeAid Shadows
			boxShadow: {
				'gradeaid': 'var(--shadow-gradeaid)',
				'gentle': 'var(--shadow-gentle)',
				'card': 'var(--shadow-card)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'gradeaid': 'var(--radius)', /* 50px cards */
				'gradeaid-button': 'var(--radius-button)' /* 100px buttons */
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
				// Gentle Game Animations (Neurodivergent-Friendly)
				'gentle-float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'soft-glow': {
					'0%, 100%': { 
						boxShadow: '0 4px 20px rgba(47, 46, 65, 0.15)',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 8px 30px rgba(47, 46, 65, 0.25)',
						transform: 'scale(1.02)'
					}
				},
				'gentle-bounce': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'50%': { transform: 'scale(1.02)', opacity: '0.8' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'subtle-shake': {
					'0%, 100%': { transform: 'translateX(0)' },
					'25%': { transform: 'translateX(-2px)' },
					'75%': { transform: 'translateX(2px)' }
				},
				'transform-to-3d': {
					'0%': { 
						transform: 'perspective(400px) rotateX(0deg) rotateY(0deg)',
						filter: 'brightness(1)'
					},
					'100%': { 
						transform: 'perspective(400px) rotateX(5deg) rotateY(5deg)',
						filter: 'brightness(1.1) drop-shadow(4px 4px 12px rgba(47, 46, 65, 0.3))'
					}
				},
				'celebration-gentle': {
					'0%': { transform: 'scale(1)', opacity: '1' },
					'50%': { transform: 'scale(1.1)', opacity: '0.9' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				// Gentle Game Animations
				'gentle-float': 'gentle-float 4s ease-in-out infinite',
				'soft-glow': 'soft-glow 3s ease-in-out infinite',
				'gentle-bounce': 'gentle-bounce 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
				'subtle-shake': 'subtle-shake 0.4s ease-in-out',
				'transform-to-3d': 'transform-to-3d 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'celebration-gentle': 'celebration-gentle 1.5s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
