import type { MonthStamp } from '../utils/dates';

export interface Link {
	label: string;
	href: string;
}

export interface Project {
	slug: string;
	name: string;
	/** Year (or range) shown on the right of the row. */
	year: string;
	/** One line, shown under the name. */
	blurb: string;
	/** Where the row links to, if anywhere. */
	href?: string;
}

export interface Role {
	title: string;
	org: string;
	start: MonthStamp;
	end: MonthStamp;
}

export const profile = {
	name: 'Conor Walsh',
	role: 'Software engineering student',
	school: { name: 'University of Limerick', href: 'https://www.ul.ie' },
	email: 'conorwalsh680@gmail.com',
	github: { label: 'GitHub', href: 'https://github.com/conorwalsh-1' },
	linkedin: { label: 'LinkedIn', href: 'https://www.linkedin.com/in/conor-walsh-959157445' },
};

export const projects: Project[] = [
	{
		slug: 'pianoforte',
		name: 'Pianoforte',
		year: '2026',
		blurb: 'A site about classical piano with a playable 88-key keyboard and a score player, deployed to AWS.',
		href: 'https://github.com/conorwalsh-1/cs4421-astro-blog',
	},
	{
		slug: 'hardware-inspector',
		name: 'Hardware Inspector',
		year: '2026',
		blurb: 'A Java tool that reads CPU, memory, PCI and USB data on Linux. I led the team of four.',
		href: 'https://github.com/conorwalsh-1/CS4421-Computer-Organisation-Assignment',
	},
	{
		slug: 'asteroid-deflection',
		name: 'Asteroid Deflection Model',
		year: '2026',
		blurb: 'How fast a spacecraft would need to hit asteroid 2024 YR4 to push it off course.',
	},
	{
		slug: 'spirula',
		name: 'Spirula',
		year: '2026',
		blurb: 'A touch-free soap dispenser with a PIR sensor, modelled and rendered in SolidWorks.',
	},
];

export const work: Role[] = [
	{ title: 'Crew Member', org: 'McDonald’s', start: '2025-09', end: 'present' },
	{ title: 'Private Tutor', org: 'Self-employed', start: '2024-09', end: 'present' },
];

export const education: Role[] = [
	{ title: 'BSc Immersive Software Engineering', org: 'University of Limerick', start: '2026-09', end: '2029-06' },
	{ title: 'Leaving Certificate, 613 points', org: 'CBS Nenagh', start: '2021-09', end: '2026-06' },
];
