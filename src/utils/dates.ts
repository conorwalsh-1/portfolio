/** A month-precision date such as `2024-09`, or `present` for an ongoing role. */
export type MonthStamp = `${number}-${number}` | 'present';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parse(stamp: Exclude<MonthStamp, 'present'>): [number, number] {
	const [year, month] = stamp.split('-').map(Number);
	if (!year || !month || month < 1 || month > 12) {
		throw new RangeError(`Invalid month stamp: ${stamp}`);
	}
	return [year, month];
}

/** Formats `2024-09` as `Sep 2024` and `present` as `Present`. */
export function formatMonth(stamp: MonthStamp): string {
	if (stamp === 'present') return 'Present';
	const [year, month] = parse(stamp);
	return `${MONTHS[month - 1]} ${year}`;
}

/** Formats a start/end pair as `Sep 2024 – Present`, collapsing a single month to one label. */
export function formatRange(start: MonthStamp, end: MonthStamp): string {
	const from = formatMonth(start);
	const to = formatMonth(end);
	return from === to ? from : `${from} – ${to}`;
}

/** Sort key for a stamp; `present` sorts after every real month. */
function sortKey(stamp: MonthStamp): number {
	if (stamp === 'present') return Number.POSITIVE_INFINITY;
	const [year, month] = parse(stamp);
	return year * 12 + month;
}

/** Most recent first: by end date, then by start date. Returns a new array. */
export function byMostRecent<T extends { start: MonthStamp; end: MonthStamp }>(entries: readonly T[]): T[] {
	return [...entries].sort((a, b) => sortKey(b.end) - sortKey(a.end) || sortKey(b.start) - sortKey(a.start));
}

/** True when `start` is not after `end`. */
export function isOrdered(start: MonthStamp, end: MonthStamp): boolean {
	return sortKey(start) <= sortKey(end);
}

/** Machine-readable value for a `<time datetime>` attribute; ongoing roles have none. */
export function toDatetime(stamp: MonthStamp): string | undefined {
	return stamp === 'present' ? undefined : stamp;
}

/** Compact year range for list rows: `2024 – Now`, or a single year when it starts and ends in one. */
export function formatYears(start: MonthStamp, end: MonthStamp): string {
	const year = (stamp: MonthStamp) => (stamp === 'present' ? 'Now' : String(parse(stamp)[0]));
	const from = year(start);
	const to = year(end);
	return from === to ? from : `${from} – ${to}`;
}
