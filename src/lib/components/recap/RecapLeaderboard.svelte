<script lang="ts">
	import type { Contributor } from "$lib/types";
	import { RecapService } from "$lib/recap/service";
	import {
		getPaletteColor,
		getUserProfileUrl,
		getContributionTitle,
		countUp,
	} from "$lib/recap/helpers";
	import {
		CircleStar,
		Trophy,
		Award,
		Inbox,
		UserIcon,
		TriangleAlert,
		ListOrdered,
	} from "@lucide/svelte";
	import "./leaderboard.css";

	let {
		loading,
		errorMessage,
		contributors,
		totalContributions,
		wikiMode,
	}: {
		loading: boolean;
		errorMessage: string | null;
		contributors: Contributor[] | undefined;
		totalContributions: number;
		wikiMode: "aew" | "tdsw";
	} = $props();
</script>

<section class="leaderboard-section">
	<div class="card card-featured">
		<div class="card-accent-bar"></div>
		<div class="card-header">
			<ListOrdered class="header-icon size-5" />
			<h2 class="card-title mb-0">Leaderboard</h2>
		</div>

		<div class="card-body p-0">
			<div class="list-group">
				{#if loading}
					<div class="state-container">
						<div class="spinner"></div>
						<p>Loading leaderboard data...</p>
					</div>
				{:else if errorMessage}
					<div class="state-container error-state">
						<TriangleAlert class="size-5" />
						<span>{errorMessage}</span>
					</div>
				{:else if contributors?.length === 0}
					<div class="empty-state">
						<Inbox class="mb-4 size-12 text-muted-foreground opacity-50" />
						<h5>No contributors found</h5>
						<p>No contribution data available for this week.</p>
					</div>
				{:else if contributors}
					{#each contributors as contributor, i (contributor.userName)}
						{@const avatarUrl = RecapService.extractAvatarUrl(
							contributor.avatar,
						)}
						<button
							class="leaderboard-item"
							onclick={() =>
								window.open(
									getUserProfileUrl(contributor.userName, wikiMode),
									"_blank",
								)}
						>
							<div
								class={["leaderboard-rank", i < 3 && `rank-${i + 1}`]}
							>
								{#if i === 0}<Trophy class="size-5" />
								{:else if i === 1}<Award class="size-5" />
								{:else if i === 2}<CircleStar class="size-5" />
								{:else}{i + 1}{/if}
							</div>

							<img
								src={avatarUrl}
								alt={contributor.userName}
								class="contributor-avatar"
								onerror={(e) => {
									const el = e.currentTarget as HTMLImageElement;
									if (el.src !== RecapService.fallbackAvatar) {
										el.src = RecapService.fallbackAvatar;
									}
								}}
							/>

							<div class="contributor-info">
								<h6>
									{contributor.userName}
									{#if contributor.isAdmin}
										<span class="admin-badge">Administrator</span>
									{/if}
								</h6>
								{#if contributor.userId && contributor.userId !== "N/A"}
									<small>
										<UserIcon class="me-1 inline size-3" />
										User ID: {contributor.userId}
									</small>
								{/if}
							</div>

							<div class="text-end">
								<div class="contributions-count">
									<span use:countUp={contributor.contributions}
										>0</span
									>
									{#if contributor.hasRelevantContributions}
										<span
											class="text-muted-foreground text-sm font-semibold"
										>
											({Number(
												contributor.totalContributions ??
													contributor.contributions,
											).toLocaleString()})
										</span>
									{/if}
								</div>
								<small class="contributions-text"> contributions </small>
							</div>
						</button>
					{/each}
				{/if}
			</div>
		</div>
	</div>
	{#if contributors && contributors.length > 0}
		<div
			class="mt-6 mb-4 flex h-6 w-full overflow-hidden rounded-md border border-border bg-muted"
		>
			{#each contributors as c, i (c.userName)}
				<div
					class="h-full transition-all duration-500 hover:opacity-80"
					style="width:{(Number(c.contributions) / totalContributions) *
						100}%;background:{getPaletteColor(i)}"
					title={getContributionTitle(c)}
				></div>
			{/each}
		</div>
		<div class="mb-4 flex flex-wrap items-center gap-3 px-1">
			{#each contributors as c, i (c.userName)}
				<span class="flex items-center text-sm text-muted-foreground font-medium">
					<span
						class="inline-block me-2 h-3 w-3 rounded-sm"
						style="background:{getPaletteColor(i)};"
					></span>
					{c.userName}
				</span>
			{/each}
		</div>
	{/if}
</section>
