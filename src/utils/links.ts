/** True for absolute http(s) links that leave the site. */
export function isExternal(href: string): boolean {
	return /^https?:\/\//i.test(href);
}

/** Attributes for a link: external links open in a new tab without leaking the opener. */
export function linkAttrs(href: string): { href: string; target?: '_blank'; rel?: string } {
	return isExternal(href) ? { href, target: '_blank', rel: 'noopener noreferrer' } : { href };
}

/** Builds a `mailto:` URL, encoding an optional subject. */
export function mailto(email: string, subject?: string): string {
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		throw new TypeError(`Invalid email address: ${email}`);
	}
	return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
}

/** Turns a heading such as "Hardware Inspector" into a URL fragment: `hardware-inspector`. */
export function slugify(text: string): string {
	return text
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
