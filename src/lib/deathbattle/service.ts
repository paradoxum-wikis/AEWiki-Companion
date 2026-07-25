import type { BattleStats, BattleRecord } from "$lib/types";

export class DeathBattleService {
	private static readonly STATS_API =
		"https://altershaper.t7ru.link/battle_stats.json";
	private static readonly RECORDS_API =
		"https://altershaper.t7ru.link/battle_records.json";
	private static readonly CACHE_DURATION = 5 * 60 * 1000;

	private static getCacheKey(type: "stats" | "records"): string {
		return `deathbattle-${type}`;
	}

	private static getCachedData<T>(type: "stats" | "records"): T | null {
		const cached = localStorage.getItem(this.getCacheKey(type));
		if (!cached) return null;

		const { data, timestamp } = JSON.parse(cached);
		if (Date.now() - timestamp < this.CACHE_DURATION) return data;

		localStorage.removeItem(this.getCacheKey(type));
		return null;
	}

	private static setCachedData<T>(type: "stats" | "records", data: T): void {
		localStorage.setItem(
			this.getCacheKey(type),
			JSON.stringify({ data, timestamp: Date.now() }),
		);
	}

	static async fetchBattleStats(): Promise<BattleStats[]> {
		const cached = this.getCachedData<BattleStats[]>("stats");
		if (cached) return cached;

		const response = await fetch(this.STATS_API);
		if (!response.ok) {
			throw new Error(
				`Failed to fetch battle stats: ${response.status}`,
			);
		}

		const data: BattleStats[] = await response.json();
		this.setCachedData("stats", data);
		return data;
	}

	static async fetchBattleRecords(): Promise<BattleRecord[]> {
		const cached = this.getCachedData<BattleRecord[]>("records");
		if (cached) return cached;

		const response = await fetch(this.RECORDS_API);
		if (!response.ok) {
			throw new Error(
				`Failed to fetch battle records: ${response.status}`,
			);
		}

		const data: BattleRecord[] = await response.json();
		data.sort(
			(a, b) =>
				new Date(b.battleDate).getTime() -
				new Date(a.battleDate).getTime(),
		);

		this.setCachedData("records", data);
		return data;
	}

	static formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	}

	static formatRelativeTime(dateString: string): string {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffMinutes = Math.floor(diffMs / (1000 * 60));

		if (diffDays > 0) {
			return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
		} else if (diffHours > 0) {
			return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
		} else if (diffMinutes > 0) {
			return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
		} else {
			return "Just now";
		}
	}
}
