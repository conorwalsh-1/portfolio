/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
	test: {
		include: ['src/**/*.test.ts'],
		environment: 'node',
		coverage: {
			provider: 'v8',
			include: ['src/utils/**/*.ts', 'src/data/**/*.ts'],
			exclude: ['**/*.test.ts'],
			thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
		},
	},
});
