<script lang="ts">
	import {
		Users,
		Swords,
		Gamepad2,
		Dices,
		Flame,
		BoneFracture,
	} from "@lucide/svelte";
	import StatCard from "$lib/components/StatCard.svelte";
	import type { TournamentRecap } from "$lib/tournament/service";

	let { q, loading }: { q: TournamentRecap | null; loading: boolean } =
		$props();

	let topDamage = $derived(
		q?.standings
			? ([...q.standings].sort(
					(a, b) => b.damageDealt - a.damageDealt,
				)[0] ?? null)
			: null,
	);
</script>

<div class="stat-grid">
	<StatCard
		label="Participants"
		value={loading ? "-" : (q?.combatants.length ?? 0)}
	>
		<Users />
	</StatCard>
	<StatCard
		label="Series Played"
		value={loading ? "-" : (q?.totalSeries ?? 0)}
	>
		<Swords />
	</StatCard>
	<StatCard label="Games Played" value={loading ? "-" : (q?.totalGames ?? 0)}>
		<Gamepad2 />
	</StatCard>
	<StatCard
		label="Total Damage Dealt"
		value={loading ? "-" : (q?.totalDamage ?? 0).toLocaleString()}
	>
		<Flame />
	</StatCard>
	<StatCard label="Total Bets" value={loading ? "-" : (q?.totalBets ?? 0)}>
		<Dices />
	</StatCard>
	{#if topDamage}
		<StatCard
			label="Most Damage"
			value={`${topDamage.name} (${topDamage.damageDealt.toLocaleString()})`}
		>
			<BoneFracture />
		</StatCard>
	{/if}
</div>

<style>
	.stat-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;

		@media (width < 56.25rem) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (width < 37.5rem) {
			grid-template-columns: 1fr;
		}
	}
</style>
