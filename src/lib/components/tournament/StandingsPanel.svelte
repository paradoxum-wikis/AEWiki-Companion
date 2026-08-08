<script lang="ts">
	import {
		Trophy,
		Award,
		CircleStar,
		Inbox,
		LoaderCircle,
	} from "@lucide/svelte";
	import * as Card from "$lib/components/ui/card/index";
	import type { PlayerStanding } from "$lib/tournament/service";

	let {
		standings,
		loading,
		error,
	}: {
		standings: PlayerStanding[];
		loading: boolean;
		error: string | null;
	} = $props();
</script>

<div class="tab-panel">
	<Card.Root>
		<Card.Header>
			<Card.Title>Man of the Tournament</Card.Title>
		</Card.Header>
		<Card.Content class="p-0">
			{#if loading}
				<div class="state-container">
					<LoaderCircle class="size-8 animate-spin text-primary" />
					<p>Loading standings...</p>
				</div>
			{:else if error}
				<div class="state-container error-state">
					<span>{error}</span>
				</div>
			{:else if standings.length === 0}
				<div class="state-container">
					<Inbox class="size-12 text-muted-foreground opacity-50" />
					<p>No standings data available.</p>
				</div>
			{:else}
				<div class="standings-list">
					{#each standings as p, i (p.userId)}
						<div class="standing-row">
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
								<div class="player-name">
									{p.name}
								</div>
								<div class="player-meta">
									{#if p.eliminatedIn}
										Eliminated: {p.eliminatedIn}
									{:else}
										Tournament Champion
									{/if}
								</div>
							</div>
							<div class="player-stats">
								<div class="record-row">
									<span class="win">{p.seriesWins}W</span>
									<span class="loss"
										>{p.seriesPlayed - p.seriesWins}L</span
									>
									<span class="games">{p.gamesPlayed}G</span>
								</div>
								<div class="damage">
									<span
										>{p.damageDealt.toLocaleString()}
										dmg</span
									>
									<span class="sep">·</span>
									<span
										>{p.hpLeftTotal.toLocaleString()}
										hp</span
									>
								</div>
							</div>
							<div class="mot-points">
								<span class="mot-value">{p.motPoints}</span>
								<span class="mot-label">pts</span>
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
		animation: fadeUp 0.7s ease-out 0.15s both;
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

	.standings-list {
		display: grid;
	}

	.standing-row {
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
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.player-meta {
		font-size: 0.8rem;
		color: var(--muted-foreground);
		margin-top: 0.2rem;
	}

	.player-stats {
		text-align: right;
		flex-shrink: 0;
	}

	.record-row {
		display: flex;
		gap: 0.6rem;
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

	.games {
		color: var(--muted-foreground);
	}

	.damage {
		display: flex;
		align-items: baseline;
		justify-content: flex-end;
		gap: 0.35rem;
		font-size: 0.75rem;
		color: var(--muted-foreground);
	}

	.damage .sep {
		opacity: 0.5;
	}

	.mot-points {
		text-align: right;
		flex-shrink: 0;
		min-width: 4rem;

		@media (width < 40rem) {
			width: 100%;
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			gap: 0.4rem;
		}
	}

	.mot-value {
		display: block;
		font-size: 1.3rem;
		font-weight: 800;
		font-family: var(--font-heading);
		color: var(--primary);
		line-height: 1;
	}

	.mot-label {
		font-size: 0.7rem;
		color: var(--muted-foreground);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
</style>
