import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const WCAG_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const colorScheme of ['dark', 'light'] as const) {
	test.describe(`${colorScheme} theme`, () => {
		test.use({ colorScheme });

		for (const path of ['/', '/404']) {
			test(`${path} has no WCAG AA violations`, async ({ page }) => {
				await page.goto(path);
				const results = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze();
				expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
			});
		}
	});
}

test('the manual theme switch also passes WCAG AA', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: /switch to (light|dark) theme/i }).click();
	const results = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze();
	expect(results.violations).toEqual([]);
});

test('keyboard users can skip straight to the content', async ({ page, browserName }) => {
	test.skip(browserName !== 'chromium', 'Tab focus order is checked in Chromium');
	await page.goto('/');
	await page.keyboard.press('Tab');
	const skip = page.getByRole('link', { name: 'Skip to content' });
	await expect(skip).toBeFocused();
	await expect(skip).toBeInViewport();
	await page.keyboard.press('Enter');
	await expect(page).toHaveURL(/#main$/);
});
