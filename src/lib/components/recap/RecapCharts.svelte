<script lang="ts">
	import type { Analytics } from "$lib/recap/analytics";
	import {
		timelineChartConfig,
		hourChartConfig,
		pageChartConfig,
	} from "$lib/recap/analytics";
	import * as Chart from "$lib/components/ui/chart/index";
	import * as Card from "$lib/components/ui/card/index";
	import { scaleBand } from "d3-scale";
	import { BarChart, PieChart, Arc, Text, LineChart } from "layerchart";
	import { curveNatural } from "d3-shape";
	import { cubicInOut } from "svelte/easing";

	let { analytics }: { analytics: Analytics } = $props();
</script>

<!-- Byte change -->
<div class="analytics-summary">
	<div class="summary-stat">
		<span class="summary-val">{analytics.total}</span>
		<span class="summary-label">total edits</span>
	</div>
	<div class="summary-stat summary-stat-add">
		<span class="summary-val">+{analytics.totalAdded.toLocaleString()}</span>
		<span class="summary-label">bytes added</span>
	</div>
	<div class="summary-stat summary-stat-rem">
		<span class="summary-val">−{analytics.totalRemoved.toLocaleString()}</span>
		<span class="summary-label">bytes removed</span>
	</div>
	<div
		class="summary-stat"
		class:summary-stat-add={analytics.netChange > 0}
		class:summary-stat-rem={analytics.netChange < 0}
	>
		<span class="summary-val">
			{analytics.netChange >= 0 ? "+" : ""}{analytics.netChange.toLocaleString()}
		</span>
		<span class="summary-label">net change</span>
	</div>
</div>

<!-- Edits per day -->
<Card.Root class="mb-4">
	<Card.Header class="pb-2">
		<Card.Title>Edits per Day</Card.Title>
	</Card.Header>
	<Card.Content>
		<Chart.Container config={timelineChartConfig} class="h-48 w-full">
			<LineChart
				data={analytics.timelineData}
				x="day"
				xScale={scaleBand()}
				axis="x"
				series={[
					{
						key: "edits",
						label: "Edits",
						color: timelineChartConfig.edits.color,
					},
				]}
				props={{
					spline: {
						curve: curveNatural,
						strokeWidth: 2,
						motion: "tween",
					},
					highlight: { points: { r: 4 } },
					xAxis: { format: (v: string) => v },
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip />
				{/snippet}
			</LineChart>
		</Chart.Container>
	</Card.Content>
</Card.Root>

<div class="analytics-grid">
	<!-- Edits by hour -->
	<Card.Root>
		<Card.Header class="pb-2">
			<Card.Title>Edits by Hour</Card.Title>
		</Card.Header>
		<Card.Content>
			<Chart.Container config={hourChartConfig} class="h-44 w-full">
				<LineChart
					data={analytics.hourChartData}
					x="hour"
					xScale={scaleBand()}
					axis="x"
					series={[
						{
							key: "edits",
							label: "Edits",
							color: hourChartConfig.edits.color,
						},
					]}
					props={{
						spline: {
							curve: curveNatural,
							strokeWidth: 2,
							motion: "tween",
						},
						highlight: { points: { r: 3 } },
						xAxis: {
							ticks: ["00h", "06h", "12h", "18h", "23h"],
							format: (v: string) => v,
						},
					}}
				>
					{#snippet tooltip()}
						<Chart.Tooltip />
					{/snippet}
				</LineChart>
			</Chart.Container>
		</Card.Content>
	</Card.Root>

	<!-- Namespace breakdown -->
	<Card.Root class="flex flex-col">
		<Card.Header class="pb-2 items-center">
			<Card.Title>Namespaces</Card.Title>
		</Card.Header>
		<Card.Content class="flex-1">
			<Chart.Container
				config={analytics.nsChartConfig}
				class="mx-auto aspect-square max-h-44"
			>
				<PieChart
					data={analytics.nsChartData}
					key="ns"
					value="count"
					cRange={analytics.nsChartData.map((d) => d.color)}
					c="color"
					props={{ pie: { motion: "tween" } }}
				>
					{#snippet tooltip()}
						<Chart.Tooltip hideLabel />
					{/snippet}
					{#snippet arc({ props, visibleData, index })}
						<Arc {...props}>
							{#snippet children({ getArcTextProps })}
								{#if visibleData[index].count / analytics.total > 0.08}
									<Text
										value={visibleData[index].ns}
										{...getArcTextProps("centroid")}
										font-size="11"
										class="fill-background"
									/>
								{/if}
							{/snippet}
						</Arc>
					{/snippet}
				</PieChart>
			</Chart.Container>
		</Card.Content>
		<Card.Footer class="flex-wrap gap-2 justify-center">
			{#each analytics.nsChartData as d (d.ns)}
				<span class="flex items-center gap-1 text-xs text-muted-foreground">
					<span
						class="inline-block h-2.5 w-2.5 rounded-sm"
						style="background:{d.color}"
					></span>
					{d.ns}
					<span class="font-semibold text-foreground">{d.count}</span>
				</span>
			{/each}
		</Card.Footer>
	</Card.Root>
</div>

<div class="analytics-grid mt-4">
	<!-- Edit type breakdown -->
	<Card.Root class="flex flex-col">
		<Card.Header class="pb-2 items-center">
			<Card.Title>Edit Types</Card.Title>
		</Card.Header>
		<Card.Content class="flex-1">
			<Chart.Container
				config={analytics.editTypeConfig}
				class="mx-auto aspect-square max-h-44"
			>
				<PieChart
					data={analytics.editTypeData}
					key="type"
					value="count"
					cRange={analytics.editTypeData.map((d) => d.color)}
					c="color"
					props={{ pie: { motion: "tween" } }}
				>
					{#snippet tooltip()}
						<Chart.Tooltip hideLabel />
					{/snippet}
					{#snippet arc({ props, visibleData, index })}
						<Arc {...props}>
							{#snippet children({ getArcTextProps })}
								{#if visibleData[index].count / analytics.total > 0.08}
									<Text
										value={visibleData[index].type}
										{...getArcTextProps("centroid")}
										font-size="11"
										class="fill-background"
									/>
								{/if}
							{/snippet}
						</Arc>
					{/snippet}
				</PieChart>
			</Chart.Container>
		</Card.Content>
		<Card.Footer class="flex-wrap gap-2 justify-center">
			{#each analytics.editTypeData as d (d.type)}
				<span class="flex items-center gap-1 text-xs text-muted-foreground">
					<span
						class="inline-block h-2.5 w-2.5 rounded-sm"
						style="background:{d.color}"
					></span>
					{d.type}
					<span class="font-semibold text-foreground">{d.count}</span>
				</span>
			{/each}
		</Card.Footer>
	</Card.Root>

	<!-- Top edited pages -->
	<Card.Root>
		<Card.Header class="pb-2">
			<Card.Title>Top Edited Pages</Card.Title>
		</Card.Header>
		<Card.Content>
			<Chart.Container config={pageChartConfig} class="h-44 w-full">
				<BarChart
					data={analytics.pageChartData}
					xScale={scaleBand().padding(0.25)}
					x="page"
					axis="x"
					series={[
						{
							key: "edits",
							label: "Edits",
							color: pageChartConfig.edits.color,
						},
					]}
					props={{
						bars: {
							stroke: "none",
							rounded: "top",
							motion: {
								type: "tween",
								duration: 400,
								easing: cubicInOut,
							},
						},
						xAxis: {
							format: (v: string) => v,
							tickLabelProps: {
								svgProps: {
									"font-size": 9,
									"text-anchor": "end",
								},
								rotate: -35,
							},
						},
					}}
				>
					{#snippet tooltip()}
						<Chart.Tooltip />
					{/snippet}
				</BarChart>
			</Chart.Container>
		</Card.Content>
	</Card.Root>
</div>

<style>
	.analytics-summary {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;

		@media (width < 48rem) {
			gap: 0.5rem;
		}
	}

	.summary-stat {
		flex: 1;
		min-width: 110px;
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 0.9rem 1.1rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;

		&.summary-stat-add .summary-val {
			color: oklch(0.62 0.18 145);
		}

		&.summary-stat-rem .summary-val {
			color: oklch(0.58 0.18 20);
		}
	}

	.summary-val {
		font-size: 1.3rem;
		font-weight: 800;
		color: var(--foreground);
		font-family: var(--font-heading);
		line-height: 1.1;
	}

	.summary-label {
		font-size: 0.68rem;
		color: var(--muted-foreground);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.analytics-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;

		@media (width < 48rem) {
			grid-template-columns: 1fr;
		}
	}
</style>
