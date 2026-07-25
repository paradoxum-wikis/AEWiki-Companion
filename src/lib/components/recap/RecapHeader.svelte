<script lang="ts">
	import { Trophy, ChevronLeft, ChevronRight, ChevronDown } from "@lucide/svelte";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

	const wikiOptions = [
		{ value: "aew", label: "ALTER EGO" },
		{ value: "tdsw", label: "Tower Defense Simulator" },
	] as const;

	let {
		wikiMode = $bindable(),
		prevDisabled,
		nextDisabled,
		onModeSwitch,
		onNavigate,
	}: {
		wikiMode: "aew" | "tdsw";
		prevDisabled: boolean;
		nextDisabled: boolean;
		onModeSwitch: () => void;
		onNavigate: (dir: "prev" | "next") => void;
	} = $props();

	let wikiLabel = $derived(
		wikiOptions.find((option) => option.value === wikiMode)!.label,
	);

	function handleWikiChange(value: string) {
		if (value === wikiMode) return;
		wikiMode = value as "aew" | "tdsw";
		onModeSwitch();
	}
</script>

<div class="recap-header">
	<h1 class="header-title">
		<Trophy />
		Weekly Contributor Leaderboard
	</h1>
	<div class="nav-controls">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<button {...props} class="nav-btn" aria-label="Select Wiki">
						{wikiLabel}
						<ChevronDown class="size-4 opacity-60" />
					</button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="w-56">
				<DropdownMenu.RadioGroup
					value={wikiMode}
					onValueChange={handleWikiChange}
				>
					{#each wikiOptions as option (option.value)}
						<DropdownMenu.RadioItem value={option.value}>
							{option.label}
						</DropdownMenu.RadioItem>
					{/each}
				</DropdownMenu.RadioGroup>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<button
			class="nav-btn"
			disabled={prevDisabled}
			onclick={() => onNavigate("prev")}
			aria-label="Previous Week"
		>
			<ChevronLeft class="size-4" />
			<span class="hide-mobile">Previous Week</span>
			<span class="show-mobile">Previous</span>
		</button>
		<button
			class="nav-btn"
			disabled={nextDisabled}
			onclick={() => onNavigate("next")}
			aria-label="Next Week"
		>
			<span class="hide-mobile">Next Week</span>
			<span class="show-mobile">Next</span>
			<ChevronRight class="size-4" />
		</button>
	</div>
</div>

<div class="nav-hint">
	<small>Use <kbd>←</kbd> and <kbd>→</kbd> to navigate weeks</small>
</div>

<style>
	.recap-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 4.5rem;
		margin-top: -4.5em;
		padding-bottom: 0.5rem;
		position: sticky;
		top: 0;
		z-index: 17;
		margin-bottom: 0.25rem;

		@media (width < 48rem) {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}
	}

	.header-title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-family: var(--font-heading);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--foreground);
		margin: 0;

		@media (width < 48rem) {
			display: none;
		}
	}

	.nav-controls {
		display: flex;
		gap: 0.5rem;
	}

	.nav-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.5rem 1rem;
		border-radius: 0.85rem;
		background: var(--background);
		border: 1px solid var(--border);
		color: var(--foreground);
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		&:not(:disabled):hover {
			background: var(--muted);
		}
	}

	.show-mobile {
		display: none;

		@media (width < 37.5rem) {
			display: inline;
		}
	}

	.hide-mobile {
		display: inline;

		@media (width < 37.5rem) {
			display: none;
		}
	}

	.nav-hint {
		color: var(--muted-foreground);
		font-size: 0.85rem;
		margin-top: 1.25rem;
		margin-bottom: 2rem;
		text-align: center;

		kbd {
			background: var(--muted);
			border: 1px solid var(--border);
			border-radius: 4px;
			padding: 0.1rem 0.4rem;
			font-family: monospace;
			color: var(--foreground);
		}
	}
</style>
