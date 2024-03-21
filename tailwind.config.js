/** @type {import('tailwindcss').Config} */
import { NextPreset } from "@isomerpages/isomer-components";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@isomerpages/isomer-components/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [NextPreset],
  theme: {
    extend: {
      colors: {
        // Site-specific colors, will be overwritten by individual sites
        site: {
          primary: {
            DEFAULT: "#f78f1e",
            100: "#fef4e8",
            200: "#ffeec2",
          },
          secondary: {
            DEFAULT: "#877664",
          },
        },
      },
    },
  },
};
