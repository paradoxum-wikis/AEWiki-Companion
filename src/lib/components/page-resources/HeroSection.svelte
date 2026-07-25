<script lang="ts">
	import type { GameType } from "$lib/page-resources/types";

	let { currentGame }: { currentGame: GameType } = $props();

	const gameInfo: Record<
		GameType,
		{
			title: string;
			subtitle: string;
			backgroundImage: string;
			eyebrow: string;
		}
	> = {
		TDS: {
			title: "Tower Defense Simulator",
			subtitle: "Download things to upload to the wiki xd",
			backgroundImage: "/TDSHero.png",
			eyebrow: "Page Resources",
		},
		AE: {
			title: "ALTER EGO",
			subtitle: "Stalk the development of ALTER EGO >:)",
			backgroundImage: "/AEHero.png",
			eyebrow: "Page Resources",
		},
	};
</script>

<section
	class="hero-section"
	style:background-image={`linear-gradient(135deg, rgb(8 8 12 / 0.82), rgb(8 8 12 / 0.48)), url('${gameInfo[currentGame].backgroundImage}')`}
>
	<div class="hero-copy">
		<p class="hero-eyebrow">{gameInfo[currentGame].eyebrow}</p>
		<h1>{gameInfo[currentGame].title}</h1>
		<p>{gameInfo[currentGame].subtitle}</p>
	</div>
</section>

<style>
	.hero-section {
		margin-top: 1.5rem;
		padding: clamp(1.5rem, 3vw, 2rem);
		min-height: 14rem;
		border-radius: 1.5rem;
		background-position: center;
		background-size: cover;
		position: relative;
		overflow: hidden;
		box-shadow: 0 24px 70px rgb(0 0 0 / 0.2);
	}

	.hero-copy {
		position: relative;
		z-index: 7;
	}

	.hero-eyebrow {
		margin: 0 0 0.75rem;
		color: rgb(255 255 255 / 0.72);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	h1 {
		margin: 0 0 0.75rem;
		color: white;
		font-family: var(--font-heading);
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 800;
		letter-spacing: -0.02em;
		line-height: 1.1;
	}

	p:not(.hero-eyebrow) {
		margin: 0;
		max-width: 36rem;
		color: rgb(255 255 255 / 0.82);
		font-size: 1rem;
		line-height: 1.55;
	}
</style>
