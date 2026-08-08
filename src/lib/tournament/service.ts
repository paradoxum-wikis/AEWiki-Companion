import type {
	TourneyLog,
	TournamentData,
	TourneyCombatant,
	TourneyRef,
} from "$lib/types";

export interface TournamentMatch {
	seriesId: string;
	round: string;
	roundLabel: string;
	subgroup?: number;
	conference?: "exo" | "two_x";
	aId: string | null;
	bId: string | null;
	aName: string | null;
	bName: string | null;
	aWins: number;
	bWins: number;
	winnerId: string | null;
	winnerName: string | null;
	aArcana: string | null;
	bArcana: string | null;
	winsNeeded: number;
	gameCount: number;
	refCards: MatchRefCard[];
	bets: MatchBet[];
	roundArcanas: string[];
	details: MatchGameDetail[];
}

export interface MatchRefCard {
	arcana: string;
	level: number;
	name: string | null;
}

export interface MatchBet {
	userId: string;
	pickId: string;
	name: string;
	tag: string;
}

export interface MatchGameDetail {
	gameIndex: number;
	turns: number;
	playedAt?: string;
	aId: string | null;
	bId: string | null;
	aDmg: number;
	bDmg: number;
	aHp: number;
	aMaxHp: number;
	bHp: number;
	bMaxHp: number;
	winnerId: string | null;
	winnerName: string | null;
}

export interface PlayerStanding {
	userId: string;
	name: string;
	tag: string;
	arcana: string | null;
	seriesPlayed: number;
	seriesWins: number;
	gamesPlayed: number;
	gamesWon: number;
	damageDealt: number;
	damageTaken: number;
	hpLeftTotal: number;
	motPoints: number;
	eliminatedIn: string | null;
}

export interface RefSeries {
	seriesId: string;
	round: string;
	roundLabel: string;
	gameCount: number;
	matchup: string;
}

export interface RefStanding {
	userId: string;
	name: string;
	tag: string;
	gamesOfficiated: number;
	arcana: string | null;
	series: RefSeries[];
}

export interface BetStanding {
	userId: string;
	name: string;
	tag: string;
	points: number;
}

export interface PopularityStanding {
	userId: string;
	name: string;
	tag: string;
	avgPickShare: number;
	seriesPlayed: number;
}

export interface ChampionsInfo {
	tournamentChampion: string;
	exoChampion: string;
	twoXChampion: string;
	manOfTheTournament: string;
	refOfTheTournament: string;
	gamblingAddict: string;
}

export interface TournamentWinner {
	userId: string;
	name: string;
	arcana: string | null;
}

export interface TournamentRecap {
	tournamentId: string;
	name: string;
	startDate: string;
	endDate: string;
	combatants: TourneyCombatant[];
	champions: ChampionsInfo;
	champion: TournamentWinner | null;
	bracketByRound: Record<string, TournamentMatch[]>;
	standings: PlayerStanding[];
	refStandings: RefStanding[];
	betStandings: BetStanding[];
	popularityStandings: PopularityStanding[];
	totalSeries: number;
	totalGames: number;
	totalDamage: number;
	totalBets: number;
	highestMot: TournamentWinner | null;
}

export const ARCANA_FULL_NAME: Record<string, string> = {
	fool: "The Fool",
	empress: "The Empress",
	emperor: "The Emperor",
	wheel: "Wheel of Fortune",
	death: "Death",
	tower: "The Tower",
	star: "The Star",
	justice: "Justice",
	judgement: "Judgement",
	world: "The World",
};

export const ARCANA_EFFECT: Record<string, string> = {
	fool: "If a combatant dodge a hit that would otherwise kill them, part of that damage bounces to the attacker.",
	empress:
		"Every few turns, the combatant with more HP left gets an ATK buff (later also SPD/DEF).",
	emperor:
		"Every few turns, whoever dealt more damage in that window gets a free extra turn.",
	wheel: "Every few turns, combatants swap abilities (later also random stats, and even full rerolls).",
	death: "Combatant who dies first revives at 1 HP with a SPD boost, abilities locked. Second death is final.",
	tower: "Every 6 turns, a random combatant takes true damage. Can silence abilities later.",
	star: "Each block gives the blocker +1 DEF for the rest of the game.",
	justice: "Both combatants have 100% aura for this series.",
	judgement:
		"Every 4 turns, anyone who has dealt zero direct damage that window has current HP cut in half.",
	world: "All Arcanas are activated. Both combatants have their HP quadrupled.",
};

export const ROUND_ARCANA: Record<string, string> = {
	r16: "star",
	qf: "justice",
	semi: "judgement",
	final: "world",
};

export const ARCANA_LEVEL: Record<string, number> = {
	r16: 0,
	qf: 1,
	semi: 2,
	final: 3,
};

export function arcanaLevelForRound(round: string | null | undefined): number {
	return ARCANA_LEVEL[round ?? ""] ?? 0;
}

export const ARCANA_LEVEL_EFFECT: Record<string, Record<string, string>> = {
	fool: {
		"0": "If a lethal hit is dodged, 25% of the damage bounces back at the attacker.",
		"1": "If a lethal hit is dodged, 50% of the damage bounces back at the attacker.",
		"2": "If a lethal hit is dodged, 75% of the damage bounces back at the attacker.",
		"3": "If a lethal hit is dodged, 100% of the damage bounces back at the attacker.",
	},
	empress: {
		"0": "Every 4 turns, the combatant with more HP left gains +2 ATK.",
		"1": "Every 4 turns, the combatant with more HP left gains +2 ATK and +2 SPD.",
		"2": "Every 4 turns, the combatant with more HP left gains +4 ATK and +2 SPD.",
		"3": "Every 2 turns, the combatant with more HP left gains +6 ATK, +4 DEF, +2 SPD.",
	},
	emperor: {
		"0": "Every 8 turns, whoever dealt more damage in that window gets a free extra turn.",
		"1": "Every 6 turns, whoever dealt more damage in that window gets a free extra turn.",
		"2": "Every 4 turns, whoever dealt more damage in that window gets a free extra turn.",
		"3": "Every 2 turns, whoever dealt more damage in that window gets a free extra turn.",
	},
	wheel: {
		"0": "Every 2 turns, combatants swap one ability.",
		"1": "Every 2 turns, combatants swap one ability and one stat.",
		"2": "Every 2 turns, combatants swap all abilities and one stat.",
		"3": "Every 1 turn, combatants' stats and abilities are rerolled.",
	},
	death: {
		"0": "First combatant to die revives at 1 HP with +15 SPD and abilities locked. Second death is final.",
		"1": "First combatant to die revives at 1 HP with +20 SPD and abilities locked. Second death is final.",
		"2": "First combatant to die revives at 1 HP with +25 SPD and abilities locked. Second death is final.",
		"3": "First combatant to die revives at 1 HP with +35 SPD and abilities locked. Second death is final.",
	},
	tower: {
		"0": "Every 6 turns, a random combatant takes 5 true damage.",
		"1": "Every 6 turns, a random combatant takes 10 true damage.",
		"2": "Every 6 turns, a random combatant takes 15 true damage and be silenced 2 turns.",
		"3": "Every 6 turns, a random combatant takes 30 true damage and be silenced 4 turns.",
	},
};

export function arcanaEffectAt(
	arcana: string | null | undefined,
	level: number,
): string {
	const id = arcana ?? "";
	return ARCANA_LEVEL_EFFECT[id]?.[String(level)] ?? ARCANA_EFFECT[id] ?? "";
}

export function arcanaFullName(
	arcana: string | null | undefined,
): string | null {
	if (!arcana) return null;
	return ARCANA_FULL_NAME[arcana] ?? arcana;
}

export function activeRoundArcanas(round: string | null | undefined): string[] {
	if (round === "final") return ["world", "justice", "star", "judgement"];
	const id = ROUND_ARCANA[round ?? ""];
	return id ? [id] : [];
}

export function roundArcanaLabel(round: string | null | undefined): string {
	return activeRoundArcanas(round)
		.map((id) => arcanaFullName(id))
		.filter(Boolean)
		.join(", ");
}

export const CONFERENCE_LABELS: Record<string, string> = {
	exo: "Exo",
	two_x: "Two X",
};

export function conferenceOf(
	match:
		{ subgroup?: number; conference?: "exo" | "two_x" } | null | undefined,
): string | null {
	if (!match) return null;
	if (match.conference) return match.conference;
	if (match.subgroup != null) return match.subgroup <= 2 ? "exo" : "two_x";
	return null;
}

const ROUND_ORDER = ["r16", "qf", "semi", "final"] as const;
const ROUND_LABELS: Record<string, string> = {
	r16: "Round of 16",
	qf: "Quarterfinals",
	semi: "Semifinals",
	final: "Final",
};
const CONFERENCE_ORDER: Record<string, number> = { exo: 1, two_x: 2 };
const REFEREE_ARCANAS = [
	"fool",
	"empress",
	"emperor",
	"wheel",
	"death",
	"tower",
];

export class TournamentService {
	private static readonly LOG_API =
		"https://altershaper.t7ru.link/tourney_log.json";
	private static readonly CACHE_KEY = "tourney-log-v1";
	private static readonly CACHE_DURATION = 5 * 60 * 1000;

	private static getCachedLog(): TourneyLog | null {
		const cached = localStorage.getItem(this.CACHE_KEY);
		if (!cached) return null;

		const { data, timestamp } = JSON.parse(cached);
		if (Date.now() - timestamp < this.CACHE_DURATION) return data;

		localStorage.removeItem(this.CACHE_KEY);
		return null;
	}

	private static setCachedLog(data: TourneyLog): void {
		localStorage.setItem(
			this.CACHE_KEY,
			JSON.stringify({ data, timestamp: Date.now() }),
		);
	}

	static async fetchCompletedTournament(): Promise<TournamentRecap> {
		const cached = this.getCachedLog();
		const log: TourneyLog = cached ?? (await this.fetchLog());

		const completed = (log.history || []).filter(
			(t) => t.phase === "complete",
		);
		if (completed.length === 0) {
			throw new Error("No completed tournaments found.");
		}

		const latest = completed.reduce((a, b) =>
			new Date(a.updatedAt) >= new Date(b.updatedAt) ? a : b,
		);
		return this.buildRecap(latest);
	}

	private static async fetchLog(): Promise<TourneyLog> {
		const response = await fetch(this.LOG_API);
		if (!response.ok) {
			throw new Error(
				`Failed to fetch tournament log: ${response.status}`,
			);
		}
		const log = (await response.json()) as TourneyLog;
		this.setCachedLog(log);
		return log;
	}

	static buildRecap(tourney: TournamentData): TournamentRecap {
		const byId = new Map<string, TourneyCombatant>();
		for (const c of tourney.combatants || []) byId.set(c.userId, c);

		const KNOWN_NON_COMBATANTS: Record<string, string> = {
			"1312053628982267945": "Commando Glazer",
			"779722542784184322": "urity2136",
		};

		const nameOf = (userId: string | null | undefined): string | null => {
			if (!userId) return null;
			return (
				byId.get(userId)?.displayName ??
				KNOWN_NON_COMBATANTS[userId] ??
				null
			);
		};

		const arcanaBySub = new Map<number, string>();
		const arcanaByRef = new Map<string, string>();
		for (const pick of tourney.refPicks || []) {
			if (pick.subgroup != null)
				arcanaBySub.set(pick.subgroup, pick.arcana);
			if (pick.userId) arcanaByRef.set(pick.userId, pick.arcana);
		}

		const subByUser = new Map<string, number>();
		for (const [idx, id] of (tourney.slots || []).entries()) {
			subByUser.set(id, Math.floor(idx / 4) + 1);
		}
		for (const s of tourney.series || []) {
			if (s.subgroup == null) continue;
			if (s.fighterAId) subByUser.set(s.fighterAId, s.subgroup);
			if (s.fighterBId) subByUser.set(s.fighterBId, s.subgroup);
		}

		const arcanaOf = (userId: string | null): string | null => {
			if (!userId) return null;
			const sub = subByUser.get(userId);
			return sub != null ? (arcanaBySub.get(sub) ?? null) : null;
		};

		const refById = new Map<string, TourneyRef>();
		for (const r of tourney.referees || []) refById.set(r.userId, r);
		const refNameOf = (userId: string): string =>
			refById.get(userId)?.displayName ?? userId;

		const tagByUser = new Map<string, string>();
		for (const c of tourney.combatants || [])
			if (c.tag) tagByUser.set(c.userId, c.tag);
		for (const r of tourney.referees || [])
			if (r.tag) tagByUser.set(r.userId, r.tag);
		const KNOWN_TAGS: Record<string, string> = {
			"1312053628982267945": "potenthusiast",
			"779722542784184322": "urity2136",
		};
		const tagOf = (userId: string | null | undefined): string | null =>
			userId
				? (tagByUser.get(userId) ?? KNOWN_TAGS[userId] ?? null)
				: null;

		const bracketByRound: Record<string, TournamentMatch[]> = {};
		for (const round of ROUND_ORDER) bracketByRound[round] = [];

		for (const s of tourney.series || []) {
			const wins = s.wins || {};
			const match: TournamentMatch = {
				seriesId: s.id,
				round: s.round,
				roundLabel: ROUND_LABELS[s.round] ?? s.round,
				aId: s.fighterAId,
				bId: s.fighterBId,
				aName: nameOf(s.fighterAId),
				bName: nameOf(s.fighterBId),
				aWins: s.fighterAId ? wins[s.fighterAId] || 0 : 0,
				bWins: s.fighterBId ? wins[s.fighterBId] || 0 : 0,
				winnerId: s.winnerId ?? null,
				winnerName: nameOf(s.winnerId),
				aArcana: arcanaOf(s.fighterAId),
				bArcana: arcanaOf(s.fighterBId),
				winsNeeded: s.winsNeeded,
				gameCount: s.games?.length || 0,
				refCards:
					s.round === "final"
						? REFEREE_ARCANAS.map((arc) => {
								const picker = (tourney.refPicks || []).find(
									(p) => p.arcana === arc,
								);
								return {
									arcana: arc,
									level: 3,
									name: picker
										? refNameOf(picker.userId ?? "")
										: null,
								};
							})
						: (s.refIds || []).map((id) => ({
								arcana: arcanaByRef.get(id) ?? "",
								level: arcanaLevelForRound(s.round),
								name: refNameOf(id),
							})),
				roundArcanas: activeRoundArcanas(s.round),
				bets: (s.bets || []).map((b) => ({
					userId: b.userId,
					pickId: b.pickId,
					name: nameOf(b.userId) ?? refNameOf(b.userId),
					tag: tagOf(b.userId) ?? "",
				})),
				details: (s.games || []).map((g) => {
					const scores = g.scores || {};
					const a = s.fighterAId ? scores[s.fighterAId] : undefined;
					const b = s.fighterBId ? scores[s.fighterBId] : undefined;
					const aIsWinner = s.fighterAId === g.winnerId;
					const winnerId = aIsWinner ? s.fighterAId : s.fighterBId;
					return {
						gameIndex: g.gameIndex,
						turns: g.turns,
						playedAt: g.playedAt,
						aId: s.fighterAId,
						bId: s.fighterBId,
						aDmg: a?.damageDealt || 0,
						bDmg: b?.damageDealt || 0,
						aHp: a?.hpRemaining || 0,
						aMaxHp: a?.maxHp || 0,
						bHp: b?.hpRemaining || 0,
						bMaxHp: b?.maxHp || 0,
						winnerId: winnerId ?? null,
						winnerName: nameOf(winnerId),
					};
				}),
			};
			if (s.subgroup != null) match.subgroup = s.subgroup;
			if (s.conference) match.conference = s.conference;

			if (bracketByRound[match.round] !== undefined) {
				bracketByRound[match.round].push(match);
			}
		}

		for (const round of ROUND_ORDER) {
			bracketByRound[round].sort((x, y) => {
				const sx =
					(x.subgroup ?? 0) * 10 +
					(CONFERENCE_ORDER[x.conference ?? ""] ?? 0);
				const sy =
					(y.subgroup ?? 0) * 10 +
					(CONFERENCE_ORDER[y.conference ?? ""] ?? 0);
				return sx - sy;
			});
		}

		const standings = this.buildStandings(tourney, byId, arcanaOf);

		const champions: ChampionsInfo = {
			tournamentChampion: "",
			exoChampion: "",
			twoXChampion: "",
			manOfTheTournament: "",
			refOfTheTournament: "",
			gamblingAddict: "",
		};
		const awardsEntry = tourney.log?.find((e) => e.kind === "awards");
		const awards = awardsEntry?.detail as
			Record<string, string> | undefined;
		for (const key of Object.keys(champions) as (keyof ChampionsInfo)[]) {
			if (awards?.[key]) champions[key] = awards[key];
		}

		const winnerOf = (userId: string | null): TournamentWinner | null => {
			if (!userId) return null;
			return {
				userId,
				name: nameOf(userId) ?? userId,
				arcana: arcanaOf(userId),
			};
		};

		let totalDamage = 0;
		let totalGames = 0;
		let totalBets = 0;
		for (const s of tourney.series || []) {
			totalBets += s.bets?.length || 0;
			for (const g of s.games || []) {
				totalGames++;
				for (const score of Object.values(g.scores || {})) {
					totalDamage += score.damageDealt || 0;
				}
			}
		}

		const seriesByRef = new Map<string, RefSeries[]>();
		for (const s of tourney.series || []) {
			for (const refId of s.refIds || []) {
				const entry: RefSeries = {
					seriesId: s.id,
					round: s.round,
					roundLabel: ROUND_LABELS[s.round] ?? s.round,
					gameCount: s.games?.length || 0,
					matchup: [nameOf(s.fighterAId), nameOf(s.fighterBId)]
						.filter(Boolean)
						.join(" vs "),
				};
				const list = seriesByRef.get(refId) ?? [];
				list.push(entry);
				seriesByRef.set(refId, list);
			}
		}

		const refStandings: RefStanding[] = (tourney.referees || [])
			.map((r) => {
				const series = seriesByRef.get(r.userId) ?? [];
				return {
					userId: r.userId,
					name: r.displayName,
					tag: r.tag,
					gamesOfficiated:
						tourney.refGamesOfficiated?.[r.userId] || 0,
					arcana:
						(tourney.refPicks || []).find(
							(p) => p.userId === r.userId,
						)?.arcana ?? null,
					series,
				};
			})
			.sort((a, b) => b.gamesOfficiated - a.gamesOfficiated);

		const betStandings: BetStanding[] = Object.entries(
			tourney.betPoints || {},
		)
			.map(([userId, points]) => ({
				userId,
				name: nameOf(userId) ?? refNameOf(userId),
				tag: tagOf(userId) ?? "",
				points,
			}))
			.sort((a, b) => b.points - a.points);

		const popAcc = new Map<string, { userId: string; share: number; series: number; name: string; tag: string }>();
		for (const s of tourney.series || []) {
			const bets = s.bets || [];
			if (bets.length === 0) continue;
			const picksBy = new Map<string, number>();
			for (const b of bets) {
				picksBy.set(b.pickId, (picksBy.get(b.pickId) ?? 0) + 1);
			}
			for (const uid of [s.fighterAId, s.fighterBId]) {
				if (!uid) continue;
				const row = popAcc.get(uid) ?? {
					userId: uid,
					share: 0,
					series: 0,
					name: nameOf(uid) ?? uid,
					tag: tagOf(uid) ?? "",
				};
				row.share += (picksBy.get(uid) ?? 0) / bets.length;
				row.series++;
				popAcc.set(uid, row);
			}
		}
		const popularityStandings: PopularityStanding[] = Array.from(
			popAcc.values(),
		)
			.map(({ userId, share, series, name, tag }) => ({
				userId,
				name,
				tag,
				avgPickShare: series > 0 ? share / series : 0,
				seriesPlayed: series,
			}))
			.sort((a, b) => b.avgPickShare - a.avgPickShare || b.seriesPlayed - a.seriesPlayed);

		const finalMatch = bracketByRound.final?.[0] ?? null;
		const championId = champions.tournamentChampion;
		const champion = championId
			? winnerOf(championId)
			: finalMatch
				? winnerOf(finalMatch.winnerId)
				: null;

		const highestMot = standings[0] ?? null;

		return {
			tournamentId: tourney.id,
			name: "Aphonos Playoffs",
			startDate: tourney.createdAt,
			endDate: tourney.updatedAt,
			combatants: tourney.combatants || [],
			champions,
			champion,
			bracketByRound,
			standings,
			refStandings,
			betStandings,
			popularityStandings,
			totalSeries: tourney.series?.length || 0,
			totalGames,
			totalDamage,
			totalBets,
			highestMot: highestMot
				? {
						userId: highestMot.userId,
						name: highestMot.name,
						arcana: highestMot.arcana,
					}
				: null,
		};
	}

	private static buildStandings(
		tourney: TournamentData,
		byId: Map<string, TourneyCombatant>,
		arcanaOf: (id: string | null) => string | null,
	): PlayerStanding[] {
		const map = new Map<string, PlayerStanding>();
		const ensure = (userId: string): PlayerStanding => {
			let row = map.get(userId);
			if (row) return row;
			const c = byId.get(userId);
			row = {
				userId,
				name: c?.displayName ?? userId,
				tag: c?.tag ?? "",
				arcana: arcanaOf(userId),
				seriesPlayed: 0,
				seriesWins: 0,
				gamesPlayed: 0,
				gamesWon: 0,
				damageDealt: 0,
				damageTaken: 0,
				hpLeftTotal: 0,
				motPoints: 0,
				eliminatedIn: null,
			};
			map.set(userId, row);
			return row;
		};

		for (const s of tourney.series || []) {
			const winnerId = s.winnerId ?? null;
			for (const uid of [s.fighterAId, s.fighterBId]) {
				if (!uid) continue;
				const row = ensure(uid);
				row.seriesPlayed++;
				if (winnerId === uid) {
					row.seriesWins++;
				} else if (
					winnerId &&
					winnerId !== uid &&
					!row.eliminatedIn &&
					s.status === "complete"
				) {
					row.eliminatedIn = s.round;
				}
			}
			for (const g of s.games || []) {
				for (const uid of [g.winnerId, g.loserId]) {
					if (!uid) continue;
					const row = ensure(uid);
					row.gamesPlayed++;
					if (g.winnerId === uid) row.gamesWon++;
				}
				const scoreEntries = Object.entries(g.scores || {});
				for (const [uid, score] of scoreEntries) {
					const row = ensure(uid);
					row.damageDealt += score.damageDealt || 0;
					row.hpLeftTotal += score.hpRemaining || 0;
				}
				for (const [uid] of scoreEntries) {
					const row = ensure(uid);
					if (!row) continue;
					row.damageTaken += scoreEntries
						.filter(([otherId]) => otherId !== uid)
						.reduce((sum, [, s]) => sum + (s.damageDealt || 0), 0);
				}
			}
		}

		for (const [userId, points] of Object.entries(
			tourney.motScores || {},
		)) {
			ensure(userId).motPoints = points;
		}

		const standings = Array.from(map.values());
		for (const row of standings) {
			if (row.eliminatedIn) {
				row.eliminatedIn =
					ROUND_LABELS[row.eliminatedIn] ?? row.eliminatedIn;
			}
		}
		standings.sort(
			(a, b) =>
				b.motPoints - a.motPoints ||
				b.seriesWins - a.seriesWins ||
				b.gamesWon - a.gamesWon ||
				a.name.localeCompare(b.name),
		);
		return standings;
	}
}
