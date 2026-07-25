<script lang="ts">
	import { RecapService } from "$lib/recap/service";
	import { Calendar, Users, ChartColumn, Activity } from "@lucide/svelte";

	let {
		currentDate,
		totalContributors,
		top3Impact,
		averagePerUser,
	}: {
		currentDate: string;
		totalContributors: number | null;
		top3Impact: string | null;
		averagePerUser: number | null;
	} = $props();
</script>

<section class="cards-section">
	<div class="cards-grid">
		<div class="card card-week">
			<div class="card-accent-bar"></div>
			<div class="card-icon-row">
				<div class="card-icon"><Calendar class="size-5" /></div>
			</div>
			<div class="card-body">
				<h2 class="card-title">Current Week</h2>
				<p class="card-desc stat-value">
					{currentDate
						? RecapService.formatDisplayDate(currentDate)
						: "Loading..."}
				</p>
			</div>
		</div>
		<div class="card card-contributors">
			<div class="card-accent-bar"></div>
			<div class="card-icon-row">
				<div class="card-icon"><Users class="size-5" /></div>
			</div>
			<div class="card-body">
				<h2 class="card-title">Total Contributors</h2>
				<p class="card-desc stat-value">
					{totalContributors ?? "-"}
				</p>
			</div>
		</div>
		<div class="card card-impact">
			<div class="card-accent-bar"></div>
			<div class="card-icon-row">
				<div class="card-icon"><ChartColumn class="size-5" /></div>
			</div>
			<div class="card-body">
				<h2 class="card-title">Top 3's Impact</h2>
				<p class="card-desc stat-value">
					{top3Impact ?? "-"}
				</p>
			</div>
		</div>
		<div class="card card-average">
			<div class="card-accent-bar"></div>
			<div class="card-icon-row">
				<div class="card-icon"><Activity class="size-5" /></div>
			</div>
			<div class="card-body">
				<h2 class="card-title">Average per User</h2>
				<p class="card-desc stat-value">
					{averagePerUser ?? "-"}
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	.cards-section {
		margin-bottom: 2rem;
	}

	.cards-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(4, 1fr);

		@media (width < 56.25rem) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (width < 37.5rem) {
			grid-template-columns: 1fr;
		}
	}

	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 1.5rem;
		overflow: hidden;
		--card-accent: var(--primary);

		&::after {
			content: "";
			position: absolute;
			bottom: 0;
			right: 0;
			width: 24px;
			height: 24px;
			background: var(--background);
			clip-path: polygon(100% 0, 0% 100%, 100% 100%);
			opacity: 0.5;
		}

		&.card-week {
			--card-accent: oklch(0.55 0.18 20);
		}

		&.card-contributors {
			--card-accent: oklch(0.55 0.15 60);
		}

		&.card-impact {
			--card-accent: oklch(0.5 0.1 220);
		}

		&.card-average {
			--card-accent: oklch(0.55 0.15 140);
		}
	}

	.card-accent-bar {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(
			to right,
			transparent 0%,
			var(--card-accent) 30%,
			var(--card-accent) 70%,
			transparent 100%
		);
		opacity: 0.6;
	}

	.card-icon-row {
		display: flex;
		margin-bottom: 1rem;
	}

	.card-icon {
		width: 40px;
		height: 40px;
		border-radius: 8px;
		background: oklch(from var(--card-accent) l c h / 0.12);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--card-accent);
	}

	.card-title {
		font-size: 1rem;
		font-weight: 700;
		color: var(--muted-foreground);
		margin: 0 0 0.4rem;
		font-family: var(--font-heading);
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--foreground);
		margin: 0;
	}
</style>
