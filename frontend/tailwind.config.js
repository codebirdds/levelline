/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "rgb(var(--color-ink-rgb) / <alpha-value>)",
          2:       "rgb(var(--color-ink-2-rgb) / <alpha-value>)",
          3:       "rgb(var(--color-ink-3-rgb) / <alpha-value>)",
          4:       "rgb(var(--color-ink-4-rgb) / <alpha-value>)",
        },
        cream: {
          DEFAULT: "rgb(var(--color-cream-rgb) / <alpha-value>)",
          2:       "rgb(var(--color-cream-2-rgb) / <alpha-value>)",
          3:       "rgb(var(--color-cream-3-rgb) / <alpha-value>)",
        },
        gold: {
          DEFAULT: "rgb(var(--color-gold-rgb) / <alpha-value>)",
          dark:    "rgb(var(--color-gold-dark-rgb) / <alpha-value>)",
          soft:    "rgb(var(--color-gold-soft-rgb) / <alpha-value>)",
        },
        brand:   { DEFAULT: "rgb(var(--color-gold-rgb) / <alpha-value>)",
                   dark:    "rgb(var(--color-gold-dark-rgb) / <alpha-value>)",
                   soft:    "rgb(var(--color-gold-soft-rgb) / <alpha-value>)" },
        accent:  "rgb(var(--color-gold-rgb) / <alpha-value>)",
        danger:  "rgb(var(--color-danger-rgb) / <alpha-value>)",
        muted:   "rgb(var(--color-muted-rgb) / <alpha-value>)",
        subtle:  "rgb(var(--color-subtle-rgb) / <alpha-value>)",
        bg:      "var(--color-bg)",
        surface: "rgb(var(--color-surface-rgb) / <alpha-value>)",
        border:  "rgb(var(--color-border-rgb) / <alpha-value>)",
        hover:   "var(--color-hover)",
      },
      fontFamily: {
        sans:  "var(--font-sans)",
        serif: "var(--font-serif)",
      },
      fontSize: {
        xs:    ["var(--text-xs)",   { lineHeight: "var(--leading-normal)" }],
        sm:    ["var(--text-sm)",   { lineHeight: "var(--leading-normal)" }],
        base:  ["var(--text-base)", { lineHeight: "var(--leading-normal)" }],
        lg:    ["var(--text-lg)",   { lineHeight: "var(--leading-tight)"  }],
        xl:    ["var(--text-xl)",   { lineHeight: "var(--leading-tight)"  }],
        "2xl": ["var(--text-2xl)",  { lineHeight: "var(--leading-tight)"  }],
        "3xl": ["var(--text-3xl)",  { lineHeight: "var(--leading-tight)"  }],
        "4xl": ["var(--text-4xl)",  { lineHeight: "var(--leading-tight)"  }],
        "5xl": ["var(--text-5xl)",  { lineHeight: "var(--leading-tight)"  }],
        "6xl": ["var(--text-6xl)",  { lineHeight: "var(--leading-tight)"  }],
        "7xl": ["var(--text-7xl)",  { lineHeight: "var(--leading-tight)"  }],
      },
      letterSpacing: { luxe: "var(--tracking-luxe)" },
      borderRadius: {
        sm: "var(--radius-sm)", md: "var(--radius-md)",
        lg: "var(--radius-lg)", xl: "var(--radius-xl)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)", md: "var(--shadow-md)", lg: "var(--shadow-lg)",
      },
      maxWidth: { container: "var(--container-max)" },
    },
  },
  plugins: [],
};