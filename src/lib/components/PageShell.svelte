<script lang="ts">
	import BgMesh from "$lib/components/BgMesh.svelte";

	let { children }: { children: import("svelte").Snippet } = $props();
</script>

<div class="page-root">
	<BgMesh />
	<main class="page-main page-enter">
		{@render children()}
	</main>
</div>
