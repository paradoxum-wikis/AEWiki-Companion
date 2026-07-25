<script lang="ts">
	let {
		label,
		value,
		children,
	}: {
		label: string;
		value: string | number;
		children?: import("svelte").Snippet;
	} = $props();
</script>

<div class="stat-card">
	<div class="tds-icon-well tds-icon-well--accent">
		{@render children?.()}
	</div>
	<div class="stat-body">
		<span class="stat-label">{label}</span>
		<strong class="stat-value">{value}</strong>
	</div>
</div>

<style>
	.stat-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem 1.5rem;
		border: 1px solid var(--border);
		border-radius: 0.85rem;
		background: var(--card);
		color: var(--card-foreground);
	}

	.stat-body {
		display: grid;
		gap: 0.15rem;
		min-width: 0;
	}

	.stat-label {
		font-size: 0.8rem;
		color: var(--muted-foreground);
		font-weight: 600;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--foreground);
	}
</style>
