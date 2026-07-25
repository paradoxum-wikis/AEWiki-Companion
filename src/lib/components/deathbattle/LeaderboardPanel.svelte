<script lang="ts">
	import {
		Award,
		Calendar,
		CircleStar,
		Inbox,
		LoaderCircle,
		Swords,
		Trophy,
		TriangleAlert,
		Users,
	} from "@lucide/svelte";
	import * as Card from "$lib/components/ui/card/index";
	import StatCard from "$lib/components/StatCard.svelte";
	import { DeathBattleService } from "$lib/deathbattle/service";
	import type { BattleStats } from "$lib/types";

	type Mode = "normal" | "ranked";

	let {
		title,
		players,
		loading,
		error,
		mode,
		emptyMessage,
		totalPlayers,
		totalBattles,
		lastBattle,
	}: {
		title: string;
		players: BattleStats[];
		loading: boolean;
		error: string | null;
		mode: Mode;
		emptyMessage: string;
		totalPlayers: number | string;
		totalBattles: number | string;
		lastBattle: string;
	} = $props();

	function playerRow(player: BattleStats) {
		return mode === "normal"
			? {
					wins: player.wins,
					losses: player.losses,
					score: player.weightedScore,
					rate: player.winRate,
					battles: player.totalBattles,
					lastBattleAt: player.lastCasualBattleAt,
				}
			: {
					wins: player.rankedWins,
					losses: player.rankedLosses,
					score: player.rankedWeightedScore,
					rate: player.rankedWinRate,
					battles: player.rankedTotalBattles,
					lastBattleAt: player.lastRankedBattleAt,
				};
	}
</script>

<div class="tab-panel">
	<div class="stat-grid">
		<StatCard label="Total Players" value={loading ? "-" : totalPlayers}>
			<Users />
		</StatCard>
		<StatCard label="Total Battles" value={loading ? "-" : totalBattles}>
			{#if mode === "normal"}
				<Swords />
			{:else}
				<Trophy />
			{/if}
		</StatCard>
		<StatCard label="Last Battle" value={loading ? "-" : lastBattle}>
			<Calendar />
		</StatCard>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>{title}</Card.Title>
		</Card.Header>
		<Card.Content class="p-0">
			{#if loading}
				<div class="state-container">
					<LoaderCircle class="size-8 animate-spin text-primary" />
					<p>
						Loading {mode === "normal" ? "battle" : "ranked"} statistics...
					</p>
				</div>
			{:else if error}
				<div class="state-container error-state">
					<TriangleAlert class="size-5" />
					<span>{error}</span>
				</div>
			{:else if players.length === 0}
				<div class="state-container">
					<Inbox class="size-12 text-muted-foreground opacity-50" />
					<p>{emptyMessage}</p>
				</div>
			{:else}
				<div class="leaderboard-list">
					{#each players as player, i (player.userId)}
						{@const row = playerRow(player)}
						<div class="leaderboard-item">
							<div class="rank-badge" class:top3={i < 3}>
								{#if i === 0}
									<Trophy class="text-yellow-400" />
								{:else if i === 1}
									<Award class="text-gray-400" />
								{:else if i === 2}
									<CircleStar class="text-amber-600" />
								{:else}
									{i + 1}
								{/if}
							</div>
							<div class="player-info">
								<div class="player-name">{player.userTag}</div>
								<div class="player-meta">
									ID: {player.userId}
									{#if row.lastBattleAt}
										· Last: {DeathBattleService.formatRelativeTime(
											row.lastBattleAt,
										)}
									{/if}
								</div>
							</div>
							<div class="battle-stats">
								<div class="record-row">
									<span class="win">{row.wins}W</span>
									<span class="loss">{row.losses}L</span>
								</div>
								<div
									class="score"
									class:high={row.score >= 60}
									class:mid={row.score >= 40 && row.score < 60}
									class:low={row.score < 40}
								>
									{row.score} WS
								</div>
								<div class="aux">{row.battles} battles · {row.rate}%</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>

<style>
	.tab-panel {
		display: grid;
		gap: 1rem;
	}

	.stat-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;

		@media (width < 56.25rem) {
			grid-template-columns: 1fr;
		}
	}

	.state-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1rem;
		gap: 1rem;
		color: var(--muted-foreground);

		&.error-state {
			flex-direction: row;
			background: color-mix(
				in oklab,
				var(--destructive) 10%,
				transparent
			);
			border-radius: 0.85rem;
			margin: 1rem;
			padding: 1.5rem;
			color: var(--destructive);
		}
	}

	.leaderboard-list {
		display: grid;
	}

	.leaderboard-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--border);

		&:last-child {
			border-bottom: none;
		}

		@media (width < 40rem) {
			flex-wrap: wrap;
		}
	}

	.rank-badge {
		width: 2.5rem;
		height: 2.5rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		font-size: 1.1rem;
		flex-shrink: 0;
		color: var(--muted-foreground);

		&.top3 {
			font-size: 1.3rem;
		}
	}

	.player-info {
		flex: 1;
		min-width: 0;
	}

	.player-name {
		font-weight: 700;
		font-size: 0.95rem;
		color: var(--foreground);
	}

	.player-meta {
		font-size: 0.8rem;
		color: var(--muted-foreground);
		margin-top: 0.2rem;
	}

	.battle-stats {
		text-align: right;
		flex-shrink: 0;

		@media (width < 40rem) {
			width: 100%;
			text-align: left;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}

	.record-row {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
		margin-bottom: 0.3rem;
		font-weight: 600;
	}

	.win {
		color: oklch(0.62 0.18 145);
	}

	.loss {
		color: oklch(0.58 0.18 20);
	}

	.score {
		font-weight: 800;
		font-size: 1.1rem;
		font-family: var(--font-heading);

		&.high {
			color: oklch(0.62 0.18 145);
		}

		&.mid {
			color: oklch(0.65 0.14 85);
		}

		&.low {
			color: oklch(0.58 0.18 20);
		}
	}

	.aux {
		font-size: 0.75rem;
		color: var(--muted-foreground);
		margin-top: 0.2rem;
	}
</style>
