import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import lucidePreprocess from "vite-plugin-lucide-preprocess";

export default defineConfig({
	plugins: [lucidePreprocess(), tailwindcss(), sveltekit()],
	server: {
		port: 1405,
	},
});
