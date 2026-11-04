/** A month-precision date such as `2024-09`, or `present` for an ongoing role. */
export type MonthStamp = `${number}-${number}` | 'present';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Formats `2024-09` as `Sep 2024` and `present` as `Present`. */
export function formatMonth(stamp: MonthStamp): string {
	if (stamp === 'present') return 'Present';
	const [year, month] = stamp.split('-').map(Number);
	if (!year || !month || month < 1 || month > 12) {
		throw new RangeError(`Invalid month stamp: ${stamp}`);
	}
	return `${MONTHS[month - 1]} ${year}`;
}

/** Formats a start/end pair as `Sep 2024 – Present`, collapsing a single month to one label. */
export function formatRange(start: MonthStamp, end: MonthStamp): string {
	const from = formatMonth(start);
	const to = formatMonth(end);
	return from === to ? from : `${from} – ${to}`;
}
