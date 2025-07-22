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
			// Blueprint and magical gradients
			backgroundImage: {
				'gradient-blueprint': 'var(--gradient-blueprint)',
				'gradient-success': 'var(--gradient-success)',
				'blueprint-grid': 'var(--blueprint-grid)'
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
				// Blueprint WOW Transformations
				'triangle-to-pyramid': {
					'0%': { 
						transform: 'perspective(400px) rotateX(0deg) scale(1)',
						filter: 'brightness(1)',
						boxShadow: 'none'
					},
					'50%': { 
						transform: 'perspective(400px) rotateX(-15deg) scale(1.1)',
						filter: 'brightness(1.2)',
						boxShadow: '0 8px 20px rgba(47, 46, 65, 0.3)'
					},
					'100%': { 
						transform: 'perspective(400px) rotateX(-10deg) rotateY(5deg) scale(1)',
						filter: 'brightness(1.1) drop-shadow(4px 4px 12px rgba(47, 46, 65, 0.4))',
						boxShadow: '0 6px 16px rgba(47, 46, 65, 0.25)'
					}
				},
				'circle-to-sphere': {
					'0%': { 
						transform: 'scale(1)',
						filter: 'brightness(1)',
						borderRadius: '50%'
					},
					'50%': { 
						transform: 'scale(1.2)',
						filter: 'brightness(1.3)',
						borderRadius: '50%'
					},
					'100%': { 
						transform: 'scale(1)',
						filter: 'brightness(1.1) drop-shadow(0 0 15px rgba(47, 46, 65, 0.3))',
						borderRadius: '50%',
						boxShadow: 'inset -6px -6px 12px rgba(0, 0, 0, 0.2), inset 6px 6px 12px rgba(255, 255, 255, 0.1)'
					}
				},
				'star-symmetry-reveal': {
					'0%': { 
						transform: 'rotate(0deg) scale(1)',
						filter: 'brightness(1)'
					},
					'50%': { 
						transform: 'rotate(180deg) scale(1.1)',
						filter: 'brightness(1.3)'
					},
					'100%': { 
						transform: 'rotate(360deg) scale(1)',
						filter: 'brightness(1.1) drop-shadow(0 0 20px rgba(47, 46, 65, 0.4))'
					}
				},
				'heart-mirror-reveal': {
					'0%': { 
						transform: 'scale(1)',
						filter: 'brightness(1)'
					},
					'50%': { 
						transform: 'scale(1.1)',
						filter: 'brightness(1.2)'
					},
					'100%': { 
						transform: 'scale(1)',
						filter: 'brightness(1.1)'
					}
				},
				'symmetry-line-appear': {
					'0%': { 
						opacity: '0',
						transform: 'scaleY(0)'
					},
					'100%': { 
						opacity: '0.7',
						transform: 'scaleY(1)'
					}
				},
				'blueprint-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 10px hsl(220 40% 50% / 0.3)',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 0 20px hsl(220 40% 50% / 0.6)',
						transform: 'scale(1.05)'
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
				'celebration-gentle': 'celebration-gentle 1.5s ease-in-out infinite',
				// Blueprint WOW Animations
				'triangle-to-pyramid': 'triangle-to-pyramid 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'circle-to-sphere': 'circle-to-sphere 1s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'star-symmetry-reveal': 'star-symmetry-reveal 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'heart-mirror-reveal': 'heart-mirror-reveal 1s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'symmetry-line-appear': 'symmetry-line-appear 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'blueprint-pulse': 'blueprint-pulse 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
