import { describe, expect, it } from 'vitest';
import { formatMonth, isOrdered } from '../utils/dates';
import { isExternal, slugify } from '../utils/links';
import { education, profile, projects, work } from './profile';

describe('profile data', () => {
	it('has a name and a valid email', () => {
		expect(profile.name).toBe('Conor Walsh');
		expect(profile.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
	});

	it('never publishes a phone number', () => {
		const everything = JSON.stringify({ profile, projects, work, education });
		expect(everything).not.toMatch(/\b0\d{2}[\s-]?\d{3}[\s-]?\d{4}\b/);
		expect(everything).not.toMatch(/\+353/);
	});

	it('only links to https URLs', () => {
		const hrefs = [
			profile.school.href,
			profile.github.href,
			profile.linkedin.href,
			...projects.flatMap((p) => (p.href ? [p.href] : [])),
		];
		for (const href of hrefs) {
			expect(isExternal(href)).toBe(true);
			expect(href.startsWith('https://')).toBe(true);
		}
	});
});

describe('projects', () => {
	it('have unique, URL-safe slugs', () => {
		const slugs = projects.map((p) => p.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
		for (const slug of slugs) expect(slugify(slug)).toBe(slug);
	});

	it('each have a one-line blurb', () => {
		for (const project of projects) {
			expect(project.blurb.length).toBeGreaterThan(20);
			expect(project.blurb.length).toBeLessThanOrEqual(110);
		}
	});
});

describe('work and education', () => {
	it.each([...work, ...education].map((e) => [e.title, e] as const))('%s has a valid date range', (_, role) => {
		expect(isOrdered(role.start, role.end)).toBe(true);
		expect(() => formatMonth(role.start)).not.toThrow();
		expect(() => formatMonth(role.end)).not.toThrow();
	});
});
