import { describe, expect, it } from 'vitest';
import { isExternal, linkAttrs, mailto, slugify } from './links';

describe('isExternal', () => {
	it('detects absolute http(s) links', () => {
		expect(isExternal('https://github.com/conorwalsh-1')).toBe(true);
		expect(isExternal('HTTP://example.com')).toBe(true);
	});

	it('treats fragments, paths and mailto as internal', () => {
		expect(isExternal('#projects')).toBe(false);
		expect(isExternal('/404')).toBe(false);
		expect(isExternal('mailto:a@b.ie')).toBe(false);
	});
});

describe('linkAttrs', () => {
	it('opens external links safely in a new tab', () => {
		expect(linkAttrs('https://example.com')).toEqual({
			href: 'https://example.com',
			target: '_blank',
			rel: 'noopener noreferrer',
		});
	});

	it('leaves internal links alone', () => {
		expect(linkAttrs('#about')).toEqual({ href: '#about' });
	});
});

describe('mailto', () => {
	it('builds a plain mailto link', () => {
		expect(mailto('conor@example.ie')).toBe('mailto:conor@example.ie');
	});

	it('encodes the subject', () => {
		expect(mailto('conor@example.ie', 'Hello & welcome')).toBe(
			'mailto:conor@example.ie?subject=Hello%20%26%20welcome',
		);
	});

	it('rejects invalid addresses', () => {
		expect(() => mailto('not-an-email')).toThrow(TypeError);
	});
});

describe('slugify', () => {
	it('makes URL-safe fragments', () => {
		expect(slugify('Hardware Inspector')).toBe('hardware-inspector');
		expect(slugify('  Spirula: Soap Dispenser! ')).toBe('spirula-soap-dispenser');
		expect(slugify('Żelazowa Wola')).toBe('zelazowa-wola');
	});
});
