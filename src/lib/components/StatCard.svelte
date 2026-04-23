<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";

	interface Props {
		label: string;
		value: string | number;
		children?: import("svelte").Snippet;
	}

	let { label, value, children }: Props = $props();
</script>

<Card.Root>
	<Card.Content class="stat-card-content">
		<div class="tds-icon-well tds-icon-well--accent">
			{@render children?.()}
		</div>
		<div class="stat-body">
			<span class="stat-label">{label}</span>
			<strong class="stat-value">{value}</strong>
		</div>
	</Card.Content>
</Card.Root>

<style>
	:global([data-slot="card-content"].stat-card-content) {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem 1.5rem;
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
