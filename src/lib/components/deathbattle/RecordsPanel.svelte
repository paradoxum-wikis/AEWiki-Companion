<script lang="ts">
	import { Heart, Inbox, LoaderCircle, TriangleAlert } from "@lucide/svelte";
	import * as Card from "$lib/components/ui/card/index";
	import { Button } from "$lib/components/ui/button/index";
	import { DeathBattleService } from "$lib/deathbattle/service";
	import { getVenueName, type Venue } from "$lib/deathbattle/sort";
	import type { BattleRecord } from "$lib/types";

	let {
		records,
		loading,
		error,
		selectedVenue = $bindable(),
		currentPage = $bindable(),
		itemsPerPage = $bindable(),
		totalPages,
	}: {
		records: BattleRecord[];
		loading: boolean;
		error: string | null;
		selectedVenue: Venue;
		currentPage: number;
		itemsPerPage: number;
		totalPages: number;
	} = $props();

	const paginatedRecords = $derived(
		records.slice(
			(currentPage - 1) * itemsPerPage,
			currentPage * itemsPerPage,
		),
	);

	function handleVenueChange(venue: Venue) {
		selectedVenue = venue;
		currentPage = 1;
	}
</script>

<div class="tab-panel">
	<Card.Root>
		<Card.Header>
			<Card.Title>Recent Battle Records</Card.Title>
			<div class="venue-pills">
				<button
					class="venue-pill"
					class:active={selectedVenue === "all"}
					onclick={() => handleVenueChange("all")}
				>
					All Venues
				</button>
				<button
					class="venue-pill"
					class:active={selectedVenue === "alter-ego"}
					onclick={() => handleVenueChange("alter-ego")}
				>
					ALTER EGO Wiki
				</button>
				<button
					class="venue-pill"
					class:active={selectedVenue === "735394249863987241"}
					onclick={() => handleVenueChange("735394249863987241")}
				>
					Tower Defense Simulator Wiki
				</button>
			</div>
		</Card.Header>
		<Card.Content class="p-0">
			{#if loading}
				<div class="state-container">
					<LoaderCircle class="size-8 animate-spin text-primary" />
					<p>Loading battle records...</p>
				</div>
			{:else if error}
				<div class="state-container error-state">
					<TriangleAlert class="size-5" />
					<span>{error}</span>
				</div>
			{:else if records.length === 0}
				<div class="state-container">
					<Inbox class="size-12 text-muted-foreground opacity-50" />
					<p>No records for the selected venue.</p>
				</div>
			{:else}
				<div class="records-list">
					{#each paginatedRecords as record (record.battleId)}
						{@const hpPercent =
							(record.winnerHpRemaining / record.winnerMaxHp) *
							100}
						<div class="record-item">
							<div class="record-header">
								<div>
									<span class="winner">{record.winnerTag}</span>
									<span class="vs">defeated</span>
									<span class="loser">{record.loserTag}</span>
								</div>
								<span
									class="type-badge"
									class:ranked={record.isRanked}
								>
									{record.isRanked ? "Ranked" : "Normal"}
								</span>
							</div>
							<div class="record-meta">
								<span class="meta-item">
									{DeathBattleService.formatDate(
										record.battleDate,
									)}
								</span>
								<span class="meta-item"
									>{getVenueName(record.guildId)}</span
								>
								<span class="meta-item">
									<Heart class="size-3 inline" />
									{record.winnerHpRemaining}/{record.winnerMaxHp}
									HP ({hpPercent.toFixed(0)}%)
								</span>
								<span class="meta-item">{record.turns} turns</span>
								<span class="meta-item meta-subtle">
									{DeathBattleService.formatRelativeTime(
										record.battleDate,
									)}
								</span>
							</div>
						</div>
					{/each}
				</div>

				{#if totalPages > 1}
					<div class="pagination">
						<div class="pagination-info">
							<label for="per-page">Per page:</label>
							<select
								id="per-page"
								bind:value={itemsPerPage}
								onchange={() => (currentPage = 1)}
							>
								<option value={10}>10</option>
								<option value={25}>25</option>
								<option value={50}>50</option>
								<option value={100}>100</option>
							</select>
						</div>

						<span class="pagination-status">
							{(currentPage - 1) * itemsPerPage +
								1}–{Math.min(
								currentPage * itemsPerPage,
								records.length,
							)} of {records.length}
						</span>

						<div class="pagination-controls">
							<Button
								variant="outline"
								size="icon-sm"
								disabled={currentPage === 1}
								onclick={() => (currentPage = 1)}
								aria-label="First page"
							>
								«
							</Button>
							<Button
								variant="outline"
								size="icon-sm"
								disabled={currentPage === 1}
								onclick={() => currentPage--}
								aria-label="Previous"
							>
								‹
							</Button>
							<span class="page-indicator">
								{currentPage} / {totalPages}
							</span>
							<Button
								variant="outline"
								size="icon-sm"
								disabled={currentPage === totalPages}
								onclick={() => currentPage++}
								aria-label="Next"
							>
								›
							</Button>
							<Button
								variant="outline"
								size="icon-sm"
								disabled={currentPage === totalPages}
								onclick={() => (currentPage = totalPages)}
								aria-label="Last page"
							>
								»
							</Button>
						</div>
					</div>
				{/if}
			{/if}
		</Card.Content>
	</Card.Root>
</div>

<style>
	.tab-panel {
		display: grid;
		gap: 1rem;
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

	.records-list {
		display: grid;
	}

	.venue-pills {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.venue-pill {
		padding: 0.4rem 0.75rem;
		border: 1px solid var(--border);
		border-radius: 0.375rem;
		background: var(--background);
		color: var(--muted-foreground);
		font-size: 0.8rem;
		font-weight: 600;
		transition:
			border-color 0.2s,
			background 0.2s,
			color 0.2s;

		&:hover {
			background: var(--muted);
			color: var(--foreground);
		}

		&.active {
			background: var(--primary);
			border-color: var(--primary);
			color: var(--primary-foreground);
		}
	}

	.record-item {
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--border);

		&:last-child {
			border-bottom: none;
		}
	}

	.record-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.winner {
		font-weight: 700;
		color: oklch(0.62 0.18 145);
	}

	.vs {
		color: var(--muted-foreground);
		font-size: 0.85rem;
		margin: 0 0.35rem;
	}

	.loser {
		color: oklch(0.58 0.18 20);
	}

	.type-badge {
		padding: 0.3rem 0.65rem;
		border-radius: 0.375rem;
		background: var(--muted);
		color: var(--foreground);
		font-size: 0.75rem;
		font-weight: 700;
		white-space: nowrap;

		&.ranked {
			background: oklch(0.95 0.04 90);
			color: oklch(0.55 0.14 85);
		}
	}

	.record-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		font-size: 0.8rem;
		color: var(--muted-foreground);
	}

	.meta-item {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}

	.meta-subtle {
		color: color-mix(in oklab, var(--muted-foreground) 70%, transparent);
	}

	.pagination {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.5rem;
		border-top: 1px solid var(--border);

		@media (width < 56.25rem) {
			flex-direction: column;
			align-items: stretch;
		}
	}

	.pagination-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
		color: var(--muted-foreground);

		select {
			padding: 0.3rem 0.6rem;
			border: 1px solid var(--border);
			border-radius: 0.5rem;
			background: var(--background);
			color: var(--foreground);
			font-size: 0.85rem;
		}
	}

	.pagination-status {
		font-size: 0.85rem;
		color: var(--muted-foreground);
	}

	.pagination-controls {
		display: flex;
		align-items: center;
		gap: 0.35rem;

		@media (width < 56.25rem) {
			justify-content: center;
		}
	}

	.page-indicator {
		padding: 0 0.75rem;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--foreground);
	}
</style>
