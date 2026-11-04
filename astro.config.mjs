// @ts-check
import { defineConfig } from 'astro/config';

// Fully static build: `astro build` writes plain HTML/CSS/JS to dist/, which can be served
// from any static host (S3 website hosting, CloudFront, GitHub Pages) with no server.
// Set `site` (and add @astrojs/sitemap) once the portfolio has a public domain.
// https://astro.build/config
export default defineConfig({
	output: 'static',
});
