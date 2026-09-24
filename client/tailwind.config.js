/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],

    //Tailwind ki default styling ko customize ya extend karne ke liye hota hai.
    theme: {
        extend: {},
    },
    plugins: [],
}