<script lang="ts">
	import { Trash2 } from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button/index";
	import { clearCache } from "$lib/page-resources/cacheManage";
	import { clearImageCache } from "$lib/page-resources/imageCache";

	let { onClearCache }: { onClearCache: () => void } = $props();

	async function clearAllCaches() {
		if (
			confirm(
				"Clear all cached data and images? This frees storage, but assets will need to be re-downloaded.",
			)
		) {
			await clearImageCache();
			clearCache();
			onClearCache();
		}
	}
</script>

<div class="settings-stack">
	<Button variant="destructive" size="sm" onclick={clearAllCaches}>
		<Trash2 />
		Clear Cache
	</Button>
	<p>
		Cache entries already expire on their own, so you only need this if you
		want to force a fresh download.
	</p>
</div>

<style>
	.settings-stack {
		display: grid;
		gap: 0.75rem;
		justify-items: start;
	}

	p {
		margin: 0;
		font-size: 0.84rem;
		line-height: 1.55;
		color: var(--muted-foreground);
	}
</style>
