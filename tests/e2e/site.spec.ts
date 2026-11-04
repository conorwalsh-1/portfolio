import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test('introduces Conor', async ({ page }) => {
	await expect(page).toHaveTitle('Conor Walsh');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Conor Walsh');
	await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /University of Limerick/);
	await expect(page.getByRole('main')).toContainText('Immersive Software Engineering');
});

test('inline links keep the spaces around them', async ({ page }) => {
	const main = page.getByRole('main');
	await expect(main).toContainText('at the University of Limerick');
	await expect(main).toContainText('Recently I built Pianoforte');
	await expect(main).toContainText('find me on GitHub and LinkedIn');
});

test('keeps to a few quiet sections', async ({ page }) => {
	const headings = page.getByRole('heading', { level: 2 });
	await expect(headings).toHaveText(['Projects', 'Work', 'Education', 'Contact']);
	await expect(page.getByRole('heading', { level: 3 })).toHaveCount(0);
	await expect(page.getByRole('navigation')).toHaveCount(0);
});

test('uses a plain sans-serif design, not a code or terminal style', async ({ page }) => {
	const fonts = await page.evaluate(() =>
		['body', 'h1', 'h2', 'a'].map((selector) => getComputedStyle(document.querySelector(selector)!).fontFamily),
	);
	for (const font of fonts) expect(font).not.toMatch(/mono|consolas|courier/i);
	await expect(page.locator('body')).not.toContainText(/\$ |whoami|~\//);
});

test('projects link to their source in a new tab', async ({ page }) => {
	const projects = page.getByRole('region', { name: 'Projects' });
	await expect(projects.getByRole('listitem')).toHaveCount(4);
	const pianoforte = projects.getByRole('link', { name: /^Pianoforte/ });
	await expect(pianoforte).toHaveAttribute('href', 'https://github.com/conorwalsh-1/cs4421-astro-blog');
	await expect(pianoforte).toHaveAttribute('target', '_blank');
	await expect(pianoforte).toHaveAttribute('rel', 'noopener noreferrer');
	await expect(projects).toContainText('Asteroid Deflection Model');
});

test('work and education are most recent first', async ({ page }) => {
	const work = page.getByRole('region', { name: 'Work' }).getByRole('listitem');
	await expect(work.first()).toContainText('Crew Member');
	await expect(work.first()).toContainText('2025 – Now');
	const education = page.getByRole('region', { name: 'Education' }).getByRole('listitem');
	await expect(education.first()).toContainText('University of Limerick');
	await expect(education.first()).toContainText('2026 – 2029');
});

test('contact links are correct and no phone number is published', async ({ page }) => {
	const contact = page.getByRole('region', { name: 'Contact' });
	await expect(contact.getByRole('link', { name: 'conorwalsh680@gmail.com' })).toHaveAttribute(
		'href',
		'mailto:conorwalsh680@gmail.com',
	);
	await expect(contact.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/conorwalsh-1');
	await expect(contact.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', /linkedin\.com\/in\//);
	await expect(page.locator('body')).not.toContainText(/085\s?158/);
});

test('every external link opens safely in a new tab', async ({ page }) => {
	const links = page.locator('a[href^="http"]');
	const count = await links.count();
	expect(count).toBeGreaterThan(0);
	for (let i = 0; i < count; i++) {
		await expect(links.nth(i)).toHaveAttribute('target', '_blank');
		await expect(links.nth(i)).toHaveAttribute('rel', 'noopener noreferrer');
	}
});

test('page never scrolls horizontally', async ({ page }) => {
	const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
	expect(overflow).toBeLessThanOrEqual(0);
});

test('unknown pages show the 404 page', async ({ page }) => {
	await page.goto('/404');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
	await page.getByRole('link', { name: 'Go to the home page' }).click();
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Conor Walsh');
});
