<script lang="ts">
	import { RotateCw, Trophy, Zap } from "@lucide/svelte";

	type Tab = "normal" | "ranked" | "records";

	let { activeTab = $bindable() }: { activeTab: Tab } = $props();
</script>

<nav class="tab-nav">
	<button
		class:active={activeTab === "normal"}
		onclick={() => (activeTab = "normal")}
		role="tab"
		aria-selected={activeTab === "normal"}
	>
		<Zap class="size-4" />
		Normal Battles
	</button>
	<button
		class:active={activeTab === "ranked"}
		onclick={() => (activeTab = "ranked")}
		role="tab"
		aria-selected={activeTab === "ranked"}
	>
		<Trophy class="size-4" />
		Ranked Battles
	</button>
	<button
		class:active={activeTab === "records"}
		onclick={() => (activeTab = "records")}
		role="tab"
		aria-selected={activeTab === "records"}
	>
		<RotateCw class="size-4" />
		Battle Records
	</button>
</nav>

<style>
	.tab-nav {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;

		button {
			display: inline-flex;
			align-items: center;
			gap: 0.5rem;
			padding: 0.65rem 1rem;
			border: 1px solid var(--border);
			border-radius: 0.75rem;
			background: var(--card);
			color: var(--muted-foreground);
			font-size: 0.9rem;
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
	}
</style>
