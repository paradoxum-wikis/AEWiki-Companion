<script lang="ts">
	import { Swords, CalendarDays } from "@lucide/svelte";

	let {
		name,
		startDate,
	}: { name: string; startDate: string } = $props();

	function formatDate(iso: string): string {
		return new Date(iso).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}
</script>

<div class="tourney-header">
	<div>
		<h1 class="header-title">
			<Swords class="size-7 text-primary" />
			{name}
		</h1>
	</div>
	<div class="header-date">
		<CalendarDays class="size-4" />
		{formatDate(startDate)}
	</div>
</div>

<style>
	.tourney-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 1rem;
		padding: 2rem 0 1.5rem;
		flex-wrap: wrap;
	}

	.header-title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin: 0;
		font-family: var(--font-heading);
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--foreground);
	}

	.header-date {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.9rem;
		border: 1px solid var(--border);
		border-radius: 0.85rem;
		background: var(--card);
		color: var(--muted-foreground);
		font-size: 0.85rem;
		font-weight: 500;
	}
</style>