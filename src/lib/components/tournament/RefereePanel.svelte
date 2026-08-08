<script lang="ts">
	import {
		Shield,
		Dices,
		LoaderCircle,
		Inbox,
	} from "@lucide/svelte";
	import * as Card from "$lib/components/ui/card/index";
	import { arcanaFullName } from "$lib/tournament/service";
	import type { RefStanding, BetStanding } from "$lib/tournament/service";

	let {
		refStandings,
		betStandings,
		loading,
	}: {
		refStandings: RefStanding[];
		betStandings: BetStanding[];
		loading: boolean;
	} = $props();
</script>

<div class="ref-bet-grid">
	<Card.Root>
		<Card.Header>
			<Card.Title>
				<span class="inline-flex items-center gap-2">
					<Shield class="size-4 text-primary" />
					Referees
				</span>
			</Card.Title>
		</Card.Header>
		<Card.Content class="p-0">
			{#if loading}
				<div class="state-container">
					<LoaderCircle class="size-6 animate-spin text-primary" />
				</div>
			{:else if refStandings.length === 0}
				<div class="state-container">
					<Inbox class="size-8 text-muted-foreground opacity-50" />
					<p>No referee data.</p>
				</div>
			{:else}
				<div class="list">
					{#each refStandings as ref (ref.userId)}
						<div class="row">
							<div class="flex flex-col items-start leading-[1.2]">
								<span class="row-name">{ref.name}</span>
								{#if ref.arcana}
									<span class="row-tag"
										>{arcanaFullName(ref.arcana)}</span
									>
								{/if}
							</div>
							<div class="row-side">
								<span class="value">{ref.gamesOfficiated}</span>
								<span class="label">games</span>
							</div>
						</div>
						{#if ref.series.length > 0}
							<div class="row-detail">
								<span class="detail-label">Officiated</span>
								{#each ref.series as s (s.seriesId)}
									<span class="off-series">
										<span class="round-name"
											>{s.roundLabel}</span
										>
										{#if s.matchup}
											<span class="matchup">{s.matchup}</span>
										{/if}
									</span>
								{/each}
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>
				<span class="inline-flex items-center gap-2">
					<Dices class="size-4 text-primary" />
					Betting Leaderboard
				</span>
			</Card.Title>
		</Card.Header>
		<Card.Content class="p-0">
			{#if loading}
				<div class="state-container">
					<LoaderCircle class="size-6 animate-spin text-primary" />
				</div>
			{:else if betStandings.length === 0}
				<div class="state-container">
					<Inbox class="size-8 text-muted-foreground opacity-50" />
					<p>No betting data.</p>
				</div>
			{:else}
				<div class="list">
					{#each betStandings as bet, i (bet.userId)}
						<div class="row">
							<div class="row-main">
								<span class="row-index">{i + 1}</span>
								<div class="flex flex-col leading-[1.2]">
									<span class="row-name">{bet.name}</span>
									{#if bet.tag}
										<span class="row-tag"
											>@{bet.tag}</span
										>
									{/if}
								</div>
							</div>
							<div class="row-side">
								<span class="value">{bet.points}</span>
								<span class="label">pts</span>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>

<style>
	.ref-bet-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
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
		padding: 2rem 1rem;
		gap: 0.75rem;
		color: var(--muted-foreground);
	}

	.list {
		display: grid;
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.8rem 1.25rem;
		border-bottom: 1px solid var(--border);

		&:last-child {
			border-bottom: none;
		}
	}

	.row-main {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		min-width: 0;
	}

	.row-index {
		width: 1.5rem;
		font-weight: 700;
		color: var(--muted-foreground);
		flex-shrink: 0;
	}

	.row-name {
		font-weight: 600;
		color: var(--foreground);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.row-tag {
		font-size: 0.68rem;
		font-weight: 600;
		color: var(--muted-foreground);
		white-space: nowrap;
	}

	.row-detail {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.35rem;
		padding: 0.5rem 1.25rem;
	}

	.detail-label {
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted-foreground);
		opacity: 0.8;
		margin-right: 0.15rem;
	}

	.off-series {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.22rem 0.6rem;
		border-radius: 999px;
		background: color-mix(
			in oklab,
			var(--muted-foreground) 8%,
			transparent
		);
		border: 1px solid var(--border);
		white-space: nowrap;
	}

	.round-name {
		font-size: 0.68rem;
		font-weight: 600;
		color: var(--foreground);
	}

	.matchup {
		font-size: 0.66rem;
		font-weight: 500;
		color: var(--muted-foreground);
		border-left: 1px solid var(--border);
		padding-left: 0.45rem;
	}

	.row-side {
		text-align: right;
		flex-shrink: 0;
	}

	.value {
		display: block;
		font-size: 1.15rem;
		font-weight: 800;
		font-family: var(--font-heading);
		color: var(--foreground);
		line-height: 1;
	}

	.label {
		font-size: 0.68rem;
		color: var(--muted-foreground);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
</style>
