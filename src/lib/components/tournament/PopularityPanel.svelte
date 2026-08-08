<script lang="ts">
	import { TrendingUp, LoaderCircle, Inbox } from "@lucide/svelte";
	import * as Card from "$lib/components/ui/card/index";
	import type { PopularityStanding } from "$lib/tournament/service";

	let {
		popularityStandings,
		loading,
	}: {
		popularityStandings: PopularityStanding[];
		loading: boolean;
	} = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>
			<span class="inline-flex items-center gap-2">
				<TrendingUp class="size-4 text-primary" />
				Betting Popularity
			</span>
		</Card.Title>
	</Card.Header>
	<Card.Content class="p-0">
		{#if loading}
			<div class="state-container">
				<LoaderCircle class="size-6 animate-spin text-primary" />
			</div>
		{:else if popularityStandings.length === 0}
			<div class="state-container">
				<Inbox class="size-8 text-muted-foreground opacity-50" />
				<p>No popularity data.</p>
			</div>
		{:else}
			<div class="list">
				{#each popularityStandings as p, i (p.userId)}
					<div class="row">
						<span class="row-index">{i + 1}</span>
						<div class="row-main">
							<div class="flex items-baseline gap-2 min-w-0">
								<span class="truncate font-semibold"
									>{p.name}</span
								>
								{#if p.tag}
									<span
										class="whitespace-nowrap text-[0.68rem] font-semibold text-muted-foreground"
										>@{p.tag}</span
									>
								{/if}
							</div>
							<div
								class="h-1.5 rounded-full bg-muted overflow-hidden max-w-full"
							>
								<div
									class="h-full rounded-full bg-primary/60"
									style="width: {(
										p.avgPickShare * 100
									).toFixed(1)}%"
								></div>
							</div>
							<span
								class="text-[0.62rem] text-muted-foreground opacity-80"
								>{p.seriesPlayed} series</span
							>
						</div>
						<div class="row-side">
							<span class="value"
								>{(p.avgPickShare * 100).toFixed(1)}%</span
							>
							<span class="label">avg picks</span>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</Card.Content>
</Card.Root>

<style>
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
		gap: 0.75rem;
		padding: 0.7rem 1.25rem;
		border-bottom: 1px solid var(--border);

		&:last-child {
			border-bottom: none;
		}
	}

	.row-index {
		width: 1.5rem;
		font-weight: 700;
		color: var(--muted-foreground);
		flex-shrink: 0;
	}

	.row-main {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.row-side {
		text-align: right;
		flex-shrink: 0;
	}

	.value {
		display: block;
		font-size: 1.05rem;
		font-weight: 800;
		font-family: var(--font-heading);
		color: var(--foreground);
		line-height: 1;
	}

	.label {
		font-size: 0.62rem;
		color: var(--muted-foreground);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
</style>
