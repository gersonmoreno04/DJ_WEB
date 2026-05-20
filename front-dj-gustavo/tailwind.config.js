/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "surface-container": "#201f20",
                "on-surface-variant": "#d3c1d6",
                "surface-variant": "#353436",
                "on-background": "#e5e2e3",
                "primary": "#e8b3ff",
                "on-primary": "#500074",
                "primary-container": "#c960ff",
                "secondary": "#d3fbff",
                "on-secondary": "#00363a",
                "tertiary": "#abd600",
                "surface": "#131314",
                "background": "#131314",
                "on-surface": "#e5e2e3",
                "surface-container-low": "#1c1b1c",
                "outline": "#9c8ba0",
                "outline-variant": "#4f4254",
            },
            fontFamily: {
                "label-md": ["Geist", "sans-serif"],
                "headline-lg": ["Montserrat", "sans-serif"],
                "headline-md": ["Montserrat", "sans-serif"],
                "headline-2xl": ["Montserrat", "sans-serif"],
                "body-md": ["Inter", "sans-serif"],
            },
            // ¡Esta es la pieza que faltaba!
            fontSize: {
                "label-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "600"}],
                "headline-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "800"}],
                "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "700"}],
                "headline-2xl": ["72px", {"lineHeight": "80px", "letterSpacing": "-0.04em", "fontWeight": "900"}],
                "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
            },
            spacing: {
                "margin-desktop": "64px",
                "section-gap": "120px"
            }
        },
    },
    plugins: [],
}