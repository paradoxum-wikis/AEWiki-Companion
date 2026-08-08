<script lang="ts">
	import { ChevronDown, LoaderCircle, Minus, Swords } from "@lucide/svelte";
	import {
		activeRoundArcanas,
		ARCANA_EFFECT,
		arcanaEffectAt,
		arcanaFullName,
		conferenceOf,
		CONFERENCE_LABELS,
	} from "$lib/tournament/service";
	import type { TournamentMatch } from "$lib/tournament/service";

	let {
		bracketByRound,
		loading,
	}: {
		bracketByRound: Record<string, TournamentMatch[]> | null;
		loading: boolean;
	} = $props();

	const ROUND_ORDER = ["r16", "qf", "semi", "final"] as const;
	const ROUND_LABELS: Record<string, string> = {
		r16: "Round of 16",
		qf: "Quarterfinals",
		semi: "Semifinals",
		final: "Final",
	};

	const columns = $derived(
		ROUND_ORDER.map((round) => ({
			round,
			label: ROUND_LABELS[round],
			matches: bracketByRound?.[round] ?? [],
		})),
	);

	let expandedId = $state<string | null>(null);

	function toggle(id: string) {
		expandedId = expandedId === id ? null : id;
	}

	function won(
		match: TournamentMatch,
		userId: string | null | undefined,
	): boolean {
		return !!userId && match.winnerId === userId;
	}

	function formatTime(iso: string): string {
		return new Date(iso).toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
		});
	}
</script>

<section class="bracket-section">
	<div class="section-head">
		<h2 class="section-title">
			<Swords class="size-6 text-primary" />
			Tournament Bracket
		</h2>
	</div>

	{#if loading}
		<div class="state-note">
			<LoaderCircle class="size-5 text-primary animate-spin" />
			Loading bracket...
		</div>
	{:else if !bracketByRound}
		<div class="state-note">No bracket data available.</div>
	{:else}
		<div class="bracket">
			{#each columns as col (col.round)}
				<div class="bracket-col">
					<div class="bracket-col-title">
						{col.label}
						<span class="count">{col.matches.length}</span>
					</div>
					<div class="bracket-matches">
						{#each col.matches as match, i (match.seriesId)}
							{@const conf = conferenceOf(match)}
							{@const prevConf =
								i > 0 ? conferenceOf(col.matches[i - 1]) : null}
							{@const expanded = expandedId === match.seriesId}
							{#if col.round === "final"
								|| (conf && conf !== prevConf)}
								<div
									class="conf-divider"
									class:exo={col.round !== "final" &&
										conf === "exo"}
									class:twox={col.round !== "final" &&
										conf === "two_x"}
								>
									{col.round === "final"
										? "Championship"
										: CONFERENCE_LABELS[conf!]}
								</div>
							{/if}
							<div
								class="match-card"
								class:open={expanded}
								onclick={() => toggle(match.seriesId)}
								role="button"
								tabindex="0"
								onkeydown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										toggle(match.seriesId);
									}
								}}
							>
								<div
									class="slot"
									class:winner={won(match, match.aId)}
									class:empty={!match.aName}
								>
									{#if match.aName}
										<span class="name">{match.aName}</span>
										<span class="score"
											>{match.aWins ?? 0}</span
										>
									{:else}
										<Minus class="size-3 opacity-40" />
									{/if}
								</div>
								<div
									class="slot"
									class:winner={won(match, match.bId)}
									class:empty={!match.bName}
								>
									{#if match.bName}
										<span class="name">{match.bName}</span>
										<span class="score"
											>{match.bWins ?? 0}</span
										>
									{:else}
										<Minus class="size-3 opacity-40" />
									{/if}
								</div>
								{#if expanded}
									<div class="match-detail">
										{#if match.details.length === 0}
											<div class="detail-empty">
												Series not played yet.
											</div>
										{:else}
											{#each match.details as g (g.gameIndex)}
												<div class="game-block">
													<div class="game-row">
														<span class="game-num">
															G{g.gameIndex + 1}
														</span>
														<span
															class="game-side"
															class:win={g.winnerId ===
																g.aId}
														>
															<span
																class="game-name"
																>{match.aName ??
																	"TBD"}</span
															>
															<span
																class="game-stats"
															>
																<span
																	class="stat"
																	>{g.aDmg.toLocaleString()}
																	dmg</span
																>
																<span
																	class="sep"
																	>·</span
																>
																<span
																	class="stat"
																	>HP {g.aHp}/{g.aMaxHp}</span
																>
															</span>
														</span>
														<span
															class="game-side"
															class:win={g.winnerId ===
																g.bId}
														>
															<span
																class="game-name"
																>{match.bName ??
																	"TBD"}</span
															>
															<span
																class="game-stats"
															>
																<span
																	class="stat"
																	>{g.bDmg.toLocaleString()}
																	dmg</span
																>
																<span
																	class="sep"
																	>·</span
																>
																<span
																	class="stat"
																	>HP {g.bHp}/{g.bMaxHp}</span
																>
															</span>
														</span>
													</div>
													<div class="game-turns">
														<span class="turns"
															>{g.turns}</span
														>
														<span
															>{g.turns === 1
																? " turn"
																: " turns"}</span
														>
														{#if g.playedAt}
															<span class="sep"
																>·</span
															>
															<span
																class="played-at"
																>{formatTime(
																	g.playedAt,
																)}</span
															>
														{/if}
													</div>
												</div>
											{/each}
											{#if match.refCards.length > 0 || match.roundArcanas.length > 0}
												<div class="detail-meta">
													<span class="meta-label"
														>Round</span
													>
													{#each match.roundArcanas as id (id)}
														<div class="meta-value">
															<span
																class="arcana-chip"
																>{arcanaFullName(
																	id,
																)}</span
															>
															<span
																class="arcana-effect"
																>{ARCANA_EFFECT[
																	id
																]}</span
															>
														</div>
													{/each}
													{#each match.refCards.filter((c) => !c.name) as card (card.arcana)}
														<div class="meta-value">
															<span
																class="arcana-chip"
																>{arcanaFullName(
																	card.arcana,
																)}</span
															>
															<span
																class="arcana-effect"
																>{arcanaEffectAt(
																	card.arcana,
																	card.level,
																)}</span
															>
														</div>
													{/each}
													<span class="meta-label referee-label"
														>Referee</span
													>
													{#each match.refCards.filter((c) => c.name) as card (card.arcana)}
														<div class="meta-value">
															<span class="ref"
																>{card.name}</span
															>
															<span
																class="arcana-chip"
																>{arcanaFullName(
																	card.arcana,
																)}</span
															>
															<span
																class="arcana-effect"
																>{arcanaEffectAt(
																	card.arcana,
																	card.level,
																)}</span
															>
														</div>
													{/each}
												</div>
											{/if}
										{/if}
									</div>
								{/if}
								<div class="match-toggle">
									<span
										>{expanded
											? "Hide games"
											: "View games"}</span
									>
									<span
										class="toggle-caret"
										class:flip={expanded}
									>
										<ChevronDown class="size-3.5" />
									</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>

<style>
	.bracket-section {
		animation: fadeUp 0.7s ease-out 0.1s both;
	}

	.section-head {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0;
		font-family: var(--font-heading);
		font-size: 1.3rem;
		font-weight: 700;
		color: var(--foreground);
	}

	.state-note {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--muted-foreground);
	}

	.bracket {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.75rem;
		overflow-x: auto;
		padding-bottom: 0.5rem;

		@media (width < 56.25rem) {
			grid-template-columns: repeat(4, minmax(220px, 1fr));
		}
	}

	.bracket-col {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 0;
	}

	.bracket-col-title {
		text-align: center;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--muted-foreground);
		white-space: nowrap;

		.count {
			background: var(--muted);
			border-radius: 6px;
			padding: 0.05rem 0.4rem;
			margin-left: 0.35rem;
			display: inline-block;
		}
	}

	.bracket-matches {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.conf-divider {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0.25rem 0;
		font-size: 0.62rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--muted-foreground);

		&::after {
			content: "";
			flex: 1;
			height: 1px;
			background: var(--border);
		}

		&.exo {
			color: var(--color-conference-exo);
		}

		&.twox {
			color: var(--color-conference-twox);
		}
	}

	.match-card {
		display: grid;
		gap: 2px;
		background: var(--border);
		padding: 2px;
		border-radius: 0.6rem;
		border: 1px solid var(--border);
		overflow: hidden;
		cursor: pointer;

		&:hover {
			border-color: color-mix(
				in oklab,
				var(--primary) 45%,
				var(--border)
			);
		}

		&.open {
			border-color: var(--primary);
		}

		> :first-child {
			border-radius: calc(0.6rem - 3px) calc(0.6rem - 3px) 0 0;
		}

		> :last-child {
			border-radius: 0 0 calc(0.6rem - 3px) calc(0.6rem - 3px);
		}
	}

	.slot {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.55rem 0.7rem;
		background: var(--card);
		font-size: 0.85rem;

		&.winner {
			background: color-mix(in oklab, var(--primary) 12%, var(--card));

			.name {
				color: var(--primary);
				font-weight: 700;
			}

			.score {
				color: var(--primary);
				font-weight: 800;
			}
		}

		&.empty {
			justify-content: center;
			padding: 0.5rem;
			background: var(--muted);
			opacity: 0.6;
		}
	}

	.name {
		flex: 1;
		min-width: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--foreground);
		font-weight: 500;
	}

	.score {
		flex-shrink: 0;
		font-weight: 700;
		color: var(--muted-foreground);
	}

	.match-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		padding: 0.3rem;
		font-size: 0.68rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--muted-foreground);
		background: var(--muted);

		.toggle-caret {
			display: inline-flex;

			&.flip {
				transform: rotate(180deg);
			}
		}
	}

	.match-detail {
		display: grid;
		gap: 1px;
		background: var(--border);
		padding: 1px;
	}

	.game-block {
		& + & {
			border-top: 1px solid var(--border);
		}
	}

	.game-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.45rem 0.6rem 0.2rem;
		background: var(--card);
		font-size: 0.75rem;
	}

	.game-num {
		flex-shrink: 0;
		font-weight: 800;
		color: var(--muted-foreground);
	}

	.game-side {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		&.win {
			color: var(--primary);
		}
	}

	.game-name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.game-stats {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.1rem 0.5rem;
		margin-top: 0.15rem;
		font-size: 0.65rem;
		font-weight: 500;
		color: var(--muted-foreground);
	}

	.arcana-chip {
		padding: 0.05rem 0.4rem;
		border-radius: 999px;
		background: color-mix(in oklab, var(--primary) 12%, transparent);
		color: var(--primary);
		font-weight: 700;
	}

	.sep {
		color: var(--muted-foreground);
		opacity: 0.6;
	}

	.turns {
		display: flex;
		align-items: baseline;
		gap: 0.2rem;
		font-size: 0.68rem;
		font-weight: 800;
		color: var(--muted-foreground);
	}

	.game-turns {
		display: flex;
		align-items: baseline;
		justify-content: center;
		gap: 0.2rem;
		padding: 0.25rem 0.5rem;
		font-size: 0.62rem;
		font-weight: 600;
		color: var(--muted-foreground);
		opacity: 0.9;
	}

	.detail-meta {
		display: grid;
		gap: 0.15rem;
		padding: 0.45rem 0.6rem;
		background: var(--card);
		font-size: 0.68rem;
		font-weight: 600;
		color: var(--muted-foreground);
		border-top: 1px solid var(--border);
	}

	.meta-label.referee-label {
		margin-top: 0.4rem;
		padding-top: 0.4rem;
		border-top: 1px solid var(--border);
	}

	.meta-value {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0.4rem;
		min-width: 0;
	}

	.arcana-effect {
		font-size: 0.6rem;
		font-weight: 500;
		line-height: 1.35;
		color: var(--muted-foreground);
		opacity: 0.9;
	}

	.meta-label {
		flex-shrink: 0;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.6rem;
		font-weight: 700;
		opacity: 0.75;
	}

	.ref {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--foreground);
		font-weight: 600;
	}

	.detail-empty {
		padding: 0.6rem;
		background: var(--card);
		font-size: 0.75rem;
		color: var(--muted-foreground);
		text-align: center;
	}
</style>
