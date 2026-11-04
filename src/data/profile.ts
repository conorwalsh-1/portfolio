import type { MonthStamp } from '../utils/dates';

export interface Link {
	label: string;
	href: string;
}

export interface Project {
	slug: string;
	name: string;
	/** When the project was built, as shown on the card. */
	when: string;
	stack: string[];
	summary: string;
	highlights: string[];
	links: Link[];
}

export interface TimelineEntry {
	title: string;
	org: string;
	location: string;
	start: MonthStamp;
	end: MonthStamp;
	points: string[];
}

export interface SkillGroup {
	name: string;
	items: string[];
}

export const profile = {
	name: 'Conor Walsh',
	handle: 'conorwalsh-1',
	role: 'Immersive Software Engineering student',
	location: 'Limerick, Ireland',
	tagline:
		'First-year software engineering student at the University of Limerick, with a background in maths, physics and engineering design.',
	about: [
		'I’m studying Immersive Software Engineering at the University of Limerick. Before university I focused on maths, physics and engineering design, and finished the Leaving Certificate with 613 CAO points, including 600/600 in Higher Level Maths.',
		'Recently I led a team of four building a Linux hardware inspector in Java, and built Pianoforte, a website about classical piano music with a playable 88-key piano, deployed to AWS with automated testing and deployment.',
		'Alongside my studies I tutor Leaving Certificate students in maths and physics, work part-time at McDonald’s, and play piano. I’m currently preparing for RIAM Grade 8.',
	],
	email: 'conorwalsh680@gmail.com',
	links: [
		{ label: 'GitHub', href: 'https://github.com/conorwalsh-1' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/conor-walsh-959157445' },
	] satisfies Link[],
};

export const projects: Project[] = [
	{
		slug: 'hardware-inspector',
		name: 'Hardware Inspector',
		when: 'Oct 2026',
		stack: ['Java', 'Linux', 'Git', 'GitHub Actions'],
		summary:
			'A Java tool that reads CPU, memory, PCI and USB data from Linux, with a live HTML report and multithreaded benchmarks.',
		highlights: [
			'Team leader for a group of four (CS4421 Computer Organisation)',
			'Assigned work and set up and ran the team’s GitHub Kanban board',
		],
		links: [{ label: 'Source', href: 'https://github.com/conorwalsh-1/CS4421-Computer-Organisation-Assignment' }],
	},
	{
		slug: 'pianoforte',
		name: 'Pianoforte',
		when: 'Sep – Oct 2026',
		stack: ['Astro', 'TypeScript', 'Docker', 'AWS CDK', 'GitHub Actions'],
		summary:
			'An interactive site on classical piano music with a playable 88-key piano and a MIDI/MusicXML score player (CS4421 DevOps).',
		highlights: [
			'CI/CD pipeline with an 80% test-coverage gate, Playwright end-to-end tests and automatic deployment on every merge',
			'AWS infrastructure as code (CDK): S3 + CloudFront and a containerised app on ECS Fargate, with alarms and rollback',
		],
		links: [{ label: 'Source', href: 'https://github.com/conorwalsh-1/cs4421-astro-blog' }],
	},
	{
		slug: 'asteroid-deflection',
		name: 'Asteroid Deflection Model',
		when: '2026',
		stack: ['Applied Maths', 'Python', 'Desmos'],
		summary:
			'Modelled the spacecraft speed needed to deflect asteroid 2024 YR4 from Earth, refined over three iterations from linear momentum to Keplerian orbital mechanics.',
		highlights: [
			'Added DART ejecta data, Yarkovsky drift and a fragmentation check',
			'Result: 973 m/s for a stony body and 2,335 m/s for a porous one',
		],
		links: [],
	},
	{
		slug: 'spirula',
		name: 'Spirula Soap Dispenser',
		when: '2026',
		stack: ['SolidWorks'],
		summary:
			'A touch-free, wall-mounted soap dispenser with a PIR sensor and a tray that collects unused soap.',
		highlights: [
			'Multi-part SolidWorks assembly with an internal pump',
			'Engineering drawings and photorealistic renders',
		],
		links: [],
	},
];

export const experience: TimelineEntry[] = [
	{
		title: 'Crew Member',
		org: 'McDonald’s',
		location: 'Nenagh, Co. Tipperary',
		start: '2025-09',
		end: 'present',
		points: [
			'Awarded Crew Member of the Month',
			'Train new staff on procedures, food-safety standards and station workflows',
			'Work across every station and keep stock levels up to date during busy periods',
		],
	},
	{
		title: 'Private Tutor',
		org: 'Self-employed',
		location: 'In person and online',
		start: '2024-09',
		end: 'present',
		points: [
			'Tutor 10+ Leaving Certificate students in Higher Level Maths, Physics, Applied Maths, English and DCG',
			'Run the business independently: scheduling, and lesson plans built around each student’s weak areas',
			'Took one student from failing their mock exams to a H3 in Higher Level Maths',
		],
	},
];

export const education: TimelineEntry[] = [
	{
		title: 'BSc Immersive Software Engineering',
		org: 'University of Limerick',
		location: 'Limerick',
		start: '2026-09',
		end: '2029-06',
		points: [],
	},
	{
		title: 'Leaving Certificate',
		org: 'CBS Nenagh',
		location: 'Nenagh, Co. Tipperary',
		start: '2021-09',
		end: '2026-06',
		points: [
			'613 CAO points, with 600/600 in Higher Level Maths',
			'H1 in Maths, Applied Maths, Physics, DCG and English',
		],
	},
];

export const awards: string[] = [
	'Maggie Gough Trophy: awarded for the top result in the country',
	'Applied Maths Team: regional winners two years running; captain; 7th nationally',
	'Pi Quiz: captain; regional winners; 4th nationally',
	'Team Maths: captain; regional winners; 12th nationally with three of four members',
	'Irish Mathematical Olympiad: 5th in the Limerick centre',
	'Piano: Grade 6 with Distinction (RIAM)',
];

export const skills: SkillGroup[] = [
	{ name: 'Programming', items: ['Java', 'Python', 'TypeScript', 'JavaScript', 'HTML/CSS'] },
	{
		name: 'DevOps & cloud',
		items: ['Git', 'GitHub Actions', 'Docker', 'AWS (CDK, S3, CloudFront, ECS)', 'Vitest', 'Playwright'],
	},
	{ name: 'Tools', items: ['Linux', 'LaTeX', 'SolidWorks', 'Microsoft Office'] },
	{ name: 'Other', items: ['Mathematical modelling', 'Team leadership', 'Agile / Kanban'] },
	{ name: 'Languages', items: ['English (native)', 'Irish'] },
];
