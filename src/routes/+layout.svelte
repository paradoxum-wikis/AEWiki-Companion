<script lang="ts">
	import "../styles/main.css";
	import "../styles/global.css";

	import { ModeWatcher, toggleMode } from "mode-watcher";
	import { SunIcon, MoonIcon, CodeXml } from "@lucide/svelte";

	let { children } = $props();
</script>

<ModeWatcher />

<svelte:head>
	<link rel="apple-touch-icon" href="/favicon.png" />
	<link rel="icon" type="image/png" href="/favicon.png" />
	<meta name="theme-color" content="#900c3f" />
	<meta name="apple-mobile-web-app-title" content="AEWiki Companion" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta
		name="apple-mobile-web-app-status-bar-style"
		content="black-translucent"
	/>
</svelte:head>

<nav class="site-nav">
	<div class="site-nav-inner">
		<a class="site-nav-brand" href="/">
			<img src="/favicon.png" alt="ALTER EGO Wiki" />
			<span class="brand-full">Paradoxum Wikis Companio</span>
			<span class="brand-short">AEWiki Companion</span>
		</a>
		<button
			class="theme-toggle"
			aria-label="Toggle theme"
			onclick={toggleMode}
		>
			<SunIcon class="sun-icon" />
			<MoonIcon class="moon-icon" />
			<span class="sr-only">Toggle theme</span>
		</button>
	</div>
</nav>

{@render children()}

<footer class="site-footer">
	<span>Not affiliated with Paradoxum Games</span>
	<a
		href="https://github.com/paradoxum-wikis/Companio"
		target="_blank"
		rel="noopener noreferrer"
	>
		Source Code
		<CodeXml aria-hidden="true" />
	</a>
</footer>
