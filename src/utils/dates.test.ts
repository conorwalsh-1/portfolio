import { describe, expect, it } from 'vitest';
import { formatMonth, formatRange } from './dates';

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
