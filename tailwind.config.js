/** @type {import('tailwindcss').Config} */
module.exports = {
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
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                csgo: {
                    default: "hsl(var(--csgo-default))",
                    red: "hsl(var(--csgo-red))",
                    lightred: "hsl(var(--csgo-lightred))",
                    darkred: "hsl(var(--csgo-darkred))",
                    bluegrey: "hsl(var(--csgo-bluegrey))",
                    blue: "hsl(var(--csgo-blue))",
                    darkblue: "hsl(var(--csgo-darkblue))",
                    purple: "hsl(var(--csgo-purple))",
                    orchid: "hsl(var(--csgo-orchid))",
                    yellow: "hsl(var(--csgo-yellow))",
                    gold: "hsl(var(--csgo-gold))",
                    lightgreen: "hsl(var(--csgo-lightgreen))",
                    green: "hsl(var(--csgo-green))",
                    lime: "hsl(var(--csgo-lime))",
                    grey: "hsl(var(--csgo-grey))",
                    grey2: "hsl(var(--csgo-grey2))",
                },
                discord: {
                    green: "hsl(var(--discord-green))",
                    yellow: "hsl(var(--discord-yellow))",
                    blue: "hsl(var(--discord-blue))",
                    coral: "hsl(var(--discord-coral))",
                    purple: "hsl(var(--discord-purple))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
