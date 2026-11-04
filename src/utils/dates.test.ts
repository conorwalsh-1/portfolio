import { describe, expect, it } from 'vitest';
import { byMostRecent, formatMonth, formatRange, formatYears, isOrdered, toDatetime } from './dates';

describe('formatMonth', () => {
	it('formats a year-month stamp', () => {
		expect(formatMonth('2024-09')).toBe('Sep 2024');
		expect(formatMonth('2026-06')).toBe('June 2026');
	});

	it('formats an ongoing role', () => {
		expect(formatMonth('present')).toBe('Present');
	});

	it('rejects out-of-range months', () => {
		expect(() => formatMonth('2024-13')).toThrow(RangeError);
		expect(() => formatMonth('2024-00')).toThrow(RangeError);
	});
});

describe('formatRange', () => {
	it('joins start and end with an en dash', () => {
		expect(formatRange('2024-09', 'present')).toBe('Sep 2024 – Present');
	});

	it('collapses a single-month range', () => {
		expect(formatRange('2026-10', '2026-10')).toBe('Oct 2026');
	});
});

describe('byMostRecent', () => {
	const entries = [
		{ id: 'old', start: '2021-09', end: '2026-06' },
		{ id: 'current-late', start: '2025-09', end: 'present' },
		{ id: 'current-early', start: '2024-09', end: 'present' },
	] as const;

	it('puts ongoing and later-ending entries first', () => {
		expect(byMostRecent(entries).map((e) => e.id)).toEqual(['current-late', 'current-early', 'old']);
	});

	it('does not mutate its input', () => {
		const copy = [...entries];
		byMostRecent(entries);
		expect(entries).toEqual(copy);
	});
});

describe('isOrdered', () => {
	it('accepts start before or equal to end', () => {
		expect(isOrdered('2024-09', 'present')).toBe(true);
		expect(isOrdered('2026-10', '2026-10')).toBe(true);
	});

	it('rejects end before start', () => {
		expect(isOrdered('2026-06', '2021-09')).toBe(false);
	});
});

describe('toDatetime', () => {
	it('passes real months through and drops present', () => {
		expect(toDatetime('2024-09')).toBe('2024-09');
		expect(toDatetime('present')).toBeUndefined();
	});
});

describe('formatYears', () => {
	it('shows a year range, with Now for ongoing roles', () => {
		expect(formatYears('2024-09', 'present')).toBe('2024 – Now');
		expect(formatYears('2021-09', '2026-06')).toBe('2021 – 2026');
	});

	it('collapses a range inside one year', () => {
		expect(formatYears('2026-01', '2026-10')).toBe('2026');
	});
});
