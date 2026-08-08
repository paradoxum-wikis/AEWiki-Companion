<script lang="ts">
	import {
		Crown,
		Trophy,
		Handshake,
		Dices,
		Sparkles,
		Shield,
	} from "@lucide/svelte";
	import type { TournamentRecap } from "$lib/tournament/service";

	let { q }: { q: TournamentRecap | null } = $props();

	function nameOf(userId: string | undefined | null): string {
		if (!userId || !q) return "-";
		return (
			q.combatants.find((c) => c.userId === userId)?.displayName ??
			q.refStandings.find((r) => r.userId === userId)?.name ??
			userId
		);
	}
</script>

<section class="champion-panel">
	{#if q}
		{#if q.champion}
			<div class="champion-card">
				<div class="champion-crown">
					<Crown class="size-8" />
				</div>
				<div class="champion-meta">
					<span class="champion-label">Tournament Champion</span>
					<span class="champion-name">{q.champion.name}</span>
				</div>
			</div>
		{/if}

		<div class="awards-grid">
			<div class="award-card">
				<div class="award-icon"><Sparkles /></div>
				<div class="award-body">
					<span class="award-label">Man of the Tournament</span>
					<span class="award-value"
						>{nameOf(q.champions.manOfTheTournament)}</span
					>
				</div>
			</div>
			<div class="award-card">
				<div class="award-icon"><Handshake /></div>
				<div class="award-body">
					<span class="award-label">Referee of the Tournament</span>
					<span class="award-value"
						>{nameOf(q.champions.refOfTheTournament)}</span
					>
				</div>
			</div>
			<div class="award-card">
				<div class="award-icon"><Trophy /></div>
				<div class="award-body">
					<span class="award-label">Exo Conference Champion</span>
					<span class="award-value"
						>{nameOf(q.champions.exoChampion)}</span
					>
				</div>
			</div>
			<div class="award-card">
				<div class="award-icon"><Trophy /></div>
				<div class="award-body">
					<span class="award-label">Two X Conference Champion</span>
					<span class="award-value"
						>{nameOf(q.champions.twoXChampion)}</span
					>
				</div>
			</div>
			<div class="award-card">
				<div class="award-icon"><Dices /></div>
				<div class="award-body">
					<span class="award-label">Gambling Addict</span>
					<span class="award-value"
						>{nameOf(q.champions.gamblingAddict)}</span
					>
				</div>
			</div>
		</div>
	{:else}
		<div class="state-container">
			<Shield class="size-8 text-muted-foreground/50" />
			<p>Waiting for tournament data...</p>
		</div>
	{/if}
</section>

<style>
	.champion-panel {
		animation: fadeUp 0.7s ease-out both;
	}

	.champion-card {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		padding: 2rem 1.75rem;
		margin-bottom: 1rem;
		border-radius: 1rem;
		border: 1px solid var(--border);
		background: linear-gradient(
			135deg,
			color-mix(in oklab, var(--primary) 18%, var(--card)),
			var(--card) 70%
		);
	}

	.champion-crown {
		width: 3.5rem;
		height: 3.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		border-radius: 1rem;
		background: color-mix(in oklab, var(--primary) 25%, transparent);
		color: var(--primary);
	}

	.champion-meta {
		display: grid;
		gap: 0.2rem;
		min-width: 0;
	}

	.champion-label {
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--muted-foreground);
		font-weight: 600;
	}

	.champion-name {
		font-family: var(--font-heading);
		font-size: 1.75rem;
		font-weight: 800;
		color: var(--foreground);
		line-height: 1.1;
	}

	.awards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 0.5rem;
	}

	.award-card {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		border: 1px solid var(--border);
		border-radius: 0.85rem;
		background: var(--card);
	}

	.award-icon {
		width: 2.25rem;
		height: 2.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		border-radius: 0.6rem;
		background: color-mix(in oklab, var(--primary) 12%, transparent);
		color: var(--primary);
	}

	.award-body {
		display: grid;
		gap: 0.1rem;
		min-width: 0;
	}

	.award-label {
		font-size: 0.72rem;
		color: var(--muted-foreground);
		font-weight: 600;
	}

	.award-value {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--foreground);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.state-container {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--muted-foreground);
	}
</style>
