<script lang="ts">
	import { onMount } from "svelte";
	import { Zap } from "@lucide/svelte";
	import { DeathBattleService } from "$lib/deathbattle/service";
	import {
		filterRecords,
		sortNormalPlayers,
		sortRankedPlayers,
		type Venue,
	} from "$lib/deathbattle/sort";
	import PageShell from "$lib/components/PageShell.svelte";
	import TabNav from "$lib/components/deathbattle/TabNav.svelte";
	import LeaderboardPanel from "$lib/components/deathbattle/LeaderboardPanel.svelte";
	import RecordsPanel from "$lib/components/deathbattle/RecordsPanel.svelte";
	import type { BattleStats, BattleRecord } from "$lib/types";

	type Tab = "normal" | "ranked" | "records";

	let activeTab = $state<Tab>("normal");
	let stats = $state<BattleStats[]>([]);
	let records = $state<BattleRecord[]>([]);
	let loadingStats = $state(true);
	let loadingRecords = $state(true);
	let errorStats = $state<string | null>(null);
	let errorRecords = $state<string | null>(null);

	let selectedVenue = $state<Venue>("all");
	let currentPage = $state(1);
	let itemsPerPage = $state(25);

	const normalPlayers = $derived(sortNormalPlayers(stats));
	const rankedPlayers = $derived(sortRankedPlayers(stats));

	const normalStats = $derived({
		totalPlayers: normalPlayers.length,
		totalBattles: normalPlayers.reduce((s, p) => s + p.totalBattles, 0),
		lastBattle: getLastBattle(
			normalPlayers
				.map((p) => p.lastCasualBattleAt)
				.filter((d): d is string => !!d),
		),
	});

	const rankedStats = $derived({
		totalPlayers: rankedPlayers.length,
		totalBattles: rankedPlayers.reduce(
			(s, p) => s + p.rankedTotalBattles,
			0,
		),
		lastBattle: getLastBattle(
			rankedPlayers
				.map((p) => p.lastRankedBattleAt)
				.filter((d): d is string => !!d),
		),
	});

	const filteredRecords = $derived(filterRecords(records, selectedVenue));

	const totalPages = $derived(
		Math.ceil(filteredRecords.length / itemsPerPage),
	);

	function getLastBattle(dates: string[]): string {
		if (dates.length === 0) return "-";
		const latest = dates.reduce((l, c) =>
			new Date(c) > new Date(l) ? c : l,
		);
		return DeathBattleService.formatRelativeTime(latest);
	}

	async function loadData() {
		loadingStats = true;
		loadingRecords = true;
		errorStats = null;
		errorRecords = null;

		try {
			stats = await DeathBattleService.fetchBattleStats();
		} catch (err) {
			errorStats =
				err instanceof Error
					? err.message
					: "Failed to load battle statistics.";
		} finally {
			loadingStats = false;
		}

		try {
			records = await DeathBattleService.fetchBattleRecords();
		} catch (err) {
			errorRecords =
				err instanceof Error
					? err.message
					: "Failed to load battle records.";
		} finally {
			loadingRecords = false;
		}
	}

	onMount(() => {
		loadData();
	});
</script>

<svelte:head>
	<title>Deathbattle Statistics | Paradoxum Wikis Companio</title>
	<meta
		name="description"
		content="View combat statistics and leaderboards from our Discord ALTERSHAPER bot."
	/>
</svelte:head>

<PageShell>
	<header class="page-header">
		<div>
			<h1>
				<Zap class="size-7 text-primary" />
				Deathbattle Statistics
			</h1>
			<p>
				The folks here sure love beating the crap out of each other
				huh...
			</p>
		</div>
	</header>

	<TabNav bind:activeTab />

	{#if activeTab === "normal"}
		<LeaderboardPanel
			title="Normal Leaderboard"
			players={normalPlayers}
			loading={loadingStats}
			error={errorStats}
			mode="normal"
			emptyMessage="No casual battle data available."
			totalPlayers={normalStats.totalPlayers}
			totalBattles={normalStats.totalBattles}
			lastBattle={normalStats.lastBattle}
		/>
	{:else if activeTab === "ranked"}
		<LeaderboardPanel
			title="Ranked Leaderboard"
			players={rankedPlayers}
			loading={loadingStats}
			error={errorStats}
			mode="ranked"
			emptyMessage="No ranked battle data available."
			totalPlayers={rankedStats.totalPlayers}
			totalBattles={rankedStats.totalBattles}
			lastBattle={rankedStats.lastBattle}
		/>
	{:else}
		<RecordsPanel
			records={filteredRecords}
			loading={loadingRecords}
			error={errorRecords}
			bind:selectedVenue
			bind:currentPage
			bind:itemsPerPage
			{totalPages}
		/>
	{/if}
</PageShell>

<style>
	.page-header {
		padding: 2rem 0 1.5rem;

		h1 {
			display: flex;
			align-items: center;
			gap: 0.75rem;
			margin: 0 0 0.5rem;
			font-family: var(--font-heading);
			font-size: 1.75rem;
			font-weight: 700;
			color: var(--foreground);
		}

		p {
			margin: 0;
			color: var(--muted-foreground);
		}
	}
</style>
