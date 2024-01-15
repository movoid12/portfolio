import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
export default defineConfig(() => {
	return {
		build: {
			outDir: "build",
		},
		plugins: [react()],
		esbuild: {
			loader: {
				".js": "jsx",
			},
		},
		alias: {
			"~": path.resolve(__dirname, "./src"),
		},
	};
});
