import { expect, test } from '@playwright/test';

const SECTIONS = ['About', 'Projects', 'Experience', 'Education', 'Skills', 'Contact'];
const NAV = ['About', 'Projects', 'Experience', 'Skills', 'Contact'];

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test('hero introduces Conor', async ({ page }) => {
	await expect(page).toHaveTitle(/Conor Walsh/);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Conor Walsh');
	await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Software Engineering/);
	await expect(page.getByRole('link', { name: 'View my work' })).toHaveAttribute('href', '#projects');
});

test('every section is present with an accessible name', async ({ page }) => {
	for (const name of SECTIONS) {
		await expect(page.getByRole('region', { name, exact: true })).toBeVisible();
	}
});

test('main navigation jumps to each section', async ({ page }) => {
	const nav = page.getByRole('navigation', { name: 'Main' });
	for (const name of NAV) {
		await nav.getByRole('link', { name, exact: true }).click();
		await expect(page).toHaveURL(new RegExp(`#${name.toLowerCase()}$`));
		await expect(page.getByRole('heading', { level: 2, name, exact: true })).toBeInViewport();
	}
});

test('uses a plain sans-serif design, not a code or terminal style', async ({ page }) => {
	const fonts = await page.evaluate(() =>
		['body', 'h1', 'h2', 'nav a'].map((selector) => getComputedStyle(document.querySelector(selector)!).fontFamily),
	);
	for (const font of fonts) expect(font).not.toMatch(/mono|consolas|courier/i);
	await expect(page.locator('body')).not.toContainText(/\$ |whoami|~\//);
});

test('projects are listed with their stacks and source links', async ({ page }) => {
	const projects = page.getByRole('region', { name: 'Projects', exact: true });
	await expect(projects.getByRole('article')).toHaveCount(4);
	const pianoforte = projects.getByRole('article', { name: 'Pianoforte' });
	await expect(pianoforte).toContainText('AWS CDK');
	const source = pianoforte.getByRole('link', { name: /view source for pianoforte/i });
	await expect(source).toHaveAttribute('href', 'https://github.com/conorwalsh-1/cs4421-astro-blog');
	await expect(source).toHaveAttribute('target', '_blank');
	await expect(source).toHaveAttribute('rel', 'noopener noreferrer');
});

test('experience and education timelines are most recent first', async ({ page }) => {
	const work = page.getByRole('list', { name: 'Work experience' });
	await expect(work.locator(':scope > li h3').first()).toHaveText('Crew Member');
	const education = page.getByRole('list', { name: 'Education history' });
	await expect(education.locator(':scope > li h3').first()).toHaveText('BSc Immersive Software Engineering');
	await expect(education.locator(':scope > li').first()).toContainText('University of Limerick');
	await expect(education.locator('time').first()).toHaveAttribute('datetime', '2026-09');
});

test('skills are grouped', async ({ page }) => {
	const skills = page.getByRole('region', { name: 'Skills', exact: true });
	await expect(skills.getByRole('term')).toHaveCount(5);
	await expect(skills.getByRole('term').first()).toHaveText('Programming');
	await expect(skills).toContainText('TypeScript');
});

test('contact links are correct and no phone number is published', async ({ page }) => {
	const contact = page.getByRole('region', { name: 'Contact', exact: true });
	await expect(contact.getByRole('link', { name: 'conorwalsh680@gmail.com' })).toHaveAttribute(
		'href',
		'mailto:conorwalsh680@gmail.com',
	);
	await expect(contact.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/conorwalsh-1');
	await expect(contact.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href', /linkedin\.com\/in\//);
	await expect(page.locator('body')).not.toContainText(/085\s?158/);
});

test('theme toggle switches theme and remembers it across reloads', async ({ page }) => {
	const html = page.locator('html');
	const toggle = page.getByRole('button', { name: /switch to (light|dark) theme/i });
	const before = await page.evaluate(() => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
	const after = before === 'dark' ? 'light' : 'dark';

	await expect(toggle).toHaveAccessibleName(`Switch to ${after} theme`);
	await toggle.click();
	await expect(html).toHaveAttribute('data-theme', after);
	await expect(toggle).toHaveAccessibleName(`Switch to ${before} theme`);

	await page.reload();
	await expect(html).toHaveAttribute('data-theme', after);
});

test('page never scrolls horizontally', async ({ page }) => {
	const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
	expect(overflow).toBeLessThanOrEqual(0);
});

test('unknown pages show the 404 page', async ({ page }) => {
	await page.goto('/404');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
	await page.getByRole('link', { name: 'Back to the home page' }).click();
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Conor Walsh');
});
