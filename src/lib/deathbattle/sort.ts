import type { BattleStats, BattleRecord } from "$lib/types";

export type Venue = "all" | "alter-ego" | "735394249863987241";

export function sortNormalPlayers(stats: BattleStats[]): BattleStats[] {
	return stats
		.filter((p) => p.totalBattles > 0)
		.sort((a, b) => {
			const aMin = a.totalBattles >= 3;
			const bMin = b.totalBattles >= 3;
			if (aMin && !bMin) return -1;
			if (!aMin && bMin) return 1;
			if (b.weightedScore !== a.weightedScore)
				return b.weightedScore - a.weightedScore;
			return b.totalBattles - a.totalBattles;
		});
}

export function sortRankedPlayers(stats: BattleStats[]): BattleStats[] {
	return stats
		.filter((p) => p.rankedTotalBattles > 0)
		.sort((a, b) => {
			const aMin = a.rankedTotalBattles >= 5;
			const bMin = b.rankedTotalBattles >= 5;
			if (aMin && !bMin) return -1;
			if (!aMin && bMin) return 1;
			if (b.rankedWeightedScore !== a.rankedWeightedScore)
				return b.rankedWeightedScore - a.rankedWeightedScore;
			return b.rankedTotalBattles - a.rankedTotalBattles;
		});
}

export function filterRecords(
	records: BattleRecord[],
	venue: Venue,
): BattleRecord[] {
	if (venue === "all") return records;
	return records.filter((r) => {
		if (venue === "alter-ego")
			return r.guildId === "1362084781134708907" || !r.guildId;
		return r.guildId === venue;
	});
}

export function getVenueName(guildId?: string): string {
	if (guildId === "735394249863987241") return "Tower Defense Simulator Wiki";
	if (guildId === "1362084781134708907" || !guildId) return "ALTER EGO Wiki";
	return "Unknown Venue";
}
