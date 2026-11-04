import { describe, expect, it } from 'vitest';
import { formatMonth, isOrdered } from '../utils/dates';
import { isExternal, slugify } from '../utils/links';
import { awards, education, experience, profile, projects, skills } from './profile';

describe('profile data', () => {
	it('has the essentials for the hero and contact sections', () => {
		expect(profile.name).toBe('Conor Walsh');
		expect(profile.about.length).toBeGreaterThan(0);
		expect(profile.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
		expect(awards.length).toBeGreaterThan(0);
	});

	it('never publishes a phone number', () => {
		const everything = JSON.stringify({ profile, projects, experience, education, awards, skills });
		expect(everything).not.toMatch(/\b0\d{2}[\s-]?\d{3}[\s-]?\d{4}\b/);
		expect(everything).not.toMatch(/\+353/);
	});

	it('only links to https URLs', () => {
		const hrefs = [...profile.links, ...projects.flatMap((p) => p.links)].map((l) => l.href);
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

	it('each have a summary, a stack and at least one highlight', () => {
		for (const project of projects) {
			expect(project.summary.length).toBeGreaterThan(20);
			expect(project.stack.length).toBeGreaterThan(0);
			expect(project.highlights.length).toBeGreaterThan(0);
		}
	});
});

describe('timeline entries', () => {
	it.each([...experience, ...education].map((e) => [e.title, e] as const))('%s has a valid date range', (_, entry) => {
		expect(isOrdered(entry.start, entry.end)).toBe(true);
		expect(() => formatMonth(entry.start)).not.toThrow();
		expect(() => formatMonth(entry.end)).not.toThrow();
	});
});

describe('skills', () => {
	it('groups have unique names and no empty or duplicate items', () => {
		const names = skills.map((g) => g.name);
		expect(new Set(names).size).toBe(names.length);
		for (const group of skills) {
			expect(group.items.length).toBeGreaterThan(0);
			expect(new Set(group.items).size).toBe(group.items.length);
		}
	});
});
