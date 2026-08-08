<script lang="ts">
	import { onMount } from "svelte";
	import { TriangleAlert, LoaderCircle } from "@lucide/svelte";
	import { TournamentService } from "$lib/tournament/service";
	import type { TournamentRecap } from "$lib/tournament/service";
	import PageShell from "$lib/components/PageShell.svelte";
	import TournamentHeader from "$lib/components/tournament/TournamentHeader.svelte";
	import ChampionPanel from "$lib/components/tournament/ChampionPanel.svelte";
	import TournamentStats from "$lib/components/tournament/TournamentStats.svelte";
	import TournamentBracket from "$lib/components/tournament/TournamentBracket.svelte";
	import StandingsPanel from "$lib/components/tournament/StandingsPanel.svelte";
	import RefereePanel from "$lib/components/tournament/RefereePanel.svelte";
	import PopularityPanel from "$lib/components/tournament/PopularityPanel.svelte";

	let recap = $state<TournamentRecap | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(() => {
		loadData();
	});

	async function loadData() {
		loading = true;
		error = null;
		try {
			recap = await TournamentService.fetchCompletedTournament();
		} catch (err) {
			error =
				err instanceof Error
					? err.message
					: "Failed to load tournament data.";
			recap = null;
		} finally {
			loading = false;
		}
	}

	function retry() {
		loadData();
	}
</script>

<svelte:head>
	<title>Tournament Recap | Paradoxum Wikis Companio</title>
	<meta
		name="description"
		content="Recap of the 2026 Aphonos Playoffs: champion, bracket, etc. from our wiki tournaments."
	/>
	<meta
		name="keywords"
		content="ALTER EGO, ALTERSHAPER, Tournament, Deathbattle, Aphonos, Playoffs, Bracket, Leaderboard"
	/>
</svelte:head>

<PageShell>
	{#if loading}
		<div class="page-state page-state-center">
			<LoaderCircle class="size-8 animate-spin text-primary" />
			<p>Loading tournament recap...</p>
		</div>
	{:else if error}
		<div class="page-state page-state-center error-state">
			<TriangleAlert class="size-5" />
			<p>{error}</p>
			<button class="retry-btn" onclick={retry}>Try again</button>
		</div>
	{:else if recap}
		<TournamentHeader name={recap.name} startDate={recap.startDate} />

		<div class="h-px bg-border my-6"></div>

		<ChampionPanel q={recap} />

		<div class="h-px bg-border my-8"></div>

		<TournamentStats q={recap} {loading} />

		<div class="h-px bg-border my-8"></div>

		<TournamentBracket bracketByRound={recap.bracketByRound} {loading} />

		<div class="h-px bg-border my-8"></div>

		<StandingsPanel standings={recap.standings} {loading} {error} />

		<div class="h-px bg-border my-8"></div>

		<RefereePanel
			refStandings={recap.refStandings}
			betStandings={recap.betStandings}
			{loading}
		/>

		<div class="h-px bg-border my-8"></div>

		<PopularityPanel
			popularityStandings={recap.popularityStandings}
			{loading}
		/>
	{/if}
</PageShell>

<style>
	.page-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 5rem 1rem;
		color: var(--muted-foreground);
	}

	.page-state-center {
		text-align: center;
	}

	.error-state {
		background: color-mix(in oklab, var(--destructive) 8%, transparent);
		border-radius: 1rem;
		margin: 2rem auto;
		max-width: 480px;
		padding: 2rem;
		color: var(--destructive);
	}

	.retry-btn {
		padding: 0.5rem 1.25rem;
		border-radius: 0.75rem;
		background: var(--primary);
		border: 1px solid var(--primary);
		color: var(--primary-foreground);
		font-weight: 600;
		cursor: pointer;
		font-size: 0.9rem;
	}
</style>
