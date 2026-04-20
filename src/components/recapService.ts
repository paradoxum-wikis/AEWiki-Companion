import type { RecapData, DateInfo } from "../types.js";

export class RecapService {
	private static readonly GITHUB_API_BASE =
		"https://api.github.com/repos/paradoxum-wikis/automation/contents/data/recap/aew";
	private static readonly GITHUB_RAW_BASE =
		"https://raw.githubusercontent.com/paradoxum-wikis/automation/main/data/recap/aew";

	private static readonly CACHE_KEY_PREFIX = "aewiki-recap-";
	private static readonly INDEX_CACHE_KEY = "aewiki-available-files-v3";
	private static readonly INDEX_CACHE_DURATION = 1 * 24 * 60 * 60 * 1000; // 1 day

	private static availableFiles: Set<string> | null = null;

	static isLegacyFormat(dateString: string): boolean {
		return dateString <= "2026-04-12";
	}

	static formatDate(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}

	static parseDate(dateString: string): DateInfo {
		const [year, month, day] = dateString.split("-").map(Number);
		return { year, month, day, dateString };
	}

	static formatDisplayDate(dateString: string): string {
		const date = new Date(dateString + "T00:00:00");
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}

	static addDays(dateString: string, days: number): string {
		const date = new Date(dateString + "T00:00:00");
		date.setDate(date.getDate() + days);
		return this.formatDate(date);
	}

	static subtractDays(dateString: string, days: number): string {
		return this.addDays(dateString, -days);
	}

	private static getCacheKey(dateString: string): string {
		return `${this.CACHE_KEY_PREFIX}${dateString}`;
	}

	private static getCachedData(dateString: string): RecapData | null {
		try {
			const cacheKey = this.getCacheKey(dateString);
			const cached = localStorage.getItem(cacheKey);
			if (!cached) return null;
			return JSON.parse(cached);
		} catch (error) {
			return null;
		}
	}

	private static setCachedData(dateString: string, data: any): void {
		try {
			localStorage.setItem(this.getCacheKey(dateString), JSON.stringify(data));
		} catch (error) {
			this.clearOldestEntries();
		}
	}

	private static clearOldestEntries(): void {
		try {
			const cacheEntries: { key: string; date: string }[] = [];
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key && key.startsWith(this.CACHE_KEY_PREFIX)) {
					cacheEntries.push({
						key,
						date: key.replace(this.CACHE_KEY_PREFIX, ""),
					});
				}
			}
			cacheEntries.sort((a, b) => a.date.localeCompare(b.date));
			const entriesToRemove = Math.ceil(cacheEntries.length * 0.25);
			for (let i = 0; i < entriesToRemove && i < cacheEntries.length; i++) {
				localStorage.removeItem(cacheEntries[i].key);
			}
		} catch (error) {}
	}

	private static async fetchAvailableFiles(): Promise<Set<string>> {
		try {
			const cached = localStorage.getItem(this.INDEX_CACHE_KEY);
			if (cached) {
				const { timestamp, files } = JSON.parse(cached);
				if (Date.now() - timestamp < this.INDEX_CACHE_DURATION) {
					return new Set(files);
				}
			}

			const availableFiles = new Set<string>();
			const rootResponse = await fetch(this.GITHUB_API_BASE);
			if (!rootResponse.ok)
				throw new Error(`Failed to fetch root: ${rootResponse.status}`);
			const rootData = await rootResponse.json();

			const modernFolders = rootData.filter(
				(i: any) =>
					i.type === "dir" && i.name !== "legacy" && /^\d{4}$/.test(i.name),
			);
			await Promise.all(
				modernFolders.map(async (folder: any) => {
					const res = await fetch(folder.url);
					if (!res.ok) return;
					const data = await res.json();
					data.forEach((item: any) => {
						const match = item.name.match(/^(\d{4}-\d{2}-\d{2})\.json$/);
						if (match) availableFiles.add(match[1]);
					});
				}),
			);

			const legacyFolder = rootData.find((i: any) => i.name === "legacy");
			if (legacyFolder) {
				const legacyRes = await fetch(legacyFolder.url);
				if (legacyRes.ok) {
					const legacyData = await legacyRes.json();

					legacyData.forEach((item: any) => {
						if (item.type === "file") {
							const match = item.name.match(
								/^recap-(\d{4}-\d{2}-\d{2})\.json$/,
							);
							if (match) availableFiles.add(match[1]);
						}
					});

					const legacyYearFolders = legacyData.filter(
						(i: any) => i.type === "dir" && /^\d{4}$/.test(i.name),
					);
					await Promise.all(
						legacyYearFolders.map(async (folder: any) => {
							const res = await fetch(folder.url);
							if (!res.ok) return;
							const data = await res.json();
							data.forEach((item: any) => {
								const match = item.name.match(
									/^recap-(\d{4}-\d{2}-\d{2})\.json$/,
								);
								if (match) availableFiles.add(match[1]);
							});
						}),
					);
				}
			}

			try {
				localStorage.setItem(
					this.INDEX_CACHE_KEY,
					JSON.stringify({
						timestamp: Date.now(),
						files: Array.from(availableFiles),
					}),
				);
			} catch (e) {}

			return availableFiles;
		} catch (error) {
			return new Set<string>();
		}
	}

	private static async ensureAvailableFiles(): Promise<void> {
		if (!this.availableFiles) {
			this.availableFiles = await this.fetchAvailableFiles();
		}
	}

	static async getAvailableDates(): Promise<string[]> {
		await this.ensureAvailableFiles();
		return this.availableFiles ? Array.from(this.availableFiles).sort() : [];
	}

	static async getPreviousDate(currentDate: string): Promise<string> {
		const dates = await this.getAvailableDates();
		if (dates.length === 0) return this.subtractDays(currentDate, 7);
		const prev = [...dates].reverse().find((d) => d < currentDate);
		return prev || this.subtractDays(currentDate, 7);
	}

	static async getNextDate(currentDate: string): Promise<string> {
		const dates = await this.getAvailableDates();
		if (dates.length === 0) return this.addDays(currentDate, 7);
		const next = dates.find((d) => d > currentDate);
		return next || this.addDays(currentDate, 7);
	}

	static async fetchRecapData(dateString: string): Promise<any> {
		const cachedData = this.getCachedData(dateString);
		if (cachedData) return cachedData;

		const { year } = this.parseDate(dateString);
		const isLegacy = this.isLegacyFormat(dateString);

		try {
			if (isLegacy) {
				const filename = `recap-${dateString}.json`;
				const yearUrl = `${this.GITHUB_RAW_BASE}/legacy/${year}/${filename}`;
				const directUrl = `${this.GITHUB_RAW_BASE}/legacy/${filename}`;

				let response = await fetch(yearUrl);
				if (!response.ok) {
					response = await fetch(directUrl);
				}

				if (!response.ok) throw new Error(`Failed to fetch legacy data`);
				const data = await response.json();

				this.setCachedData(dateString, data);
				return data;
			} else {
				const summaryUrl = `${this.GITHUB_RAW_BASE}/${year}/${dateString}.json`;
				const rawUrl = `${this.GITHUB_RAW_BASE}/${year}/${dateString}.raw.json`;

				const [summaryRes, rawRes] = await Promise.all([
					fetch(summaryUrl),
					fetch(rawUrl),
				]);
				if (!summaryRes.ok || !rawRes.ok)
					throw new Error("Failed to fetch modern recap data");

				const summary = await summaryRes.json();
				const rawData = await rawRes.json();

				const contributors = Object.entries(summary.counts)
					.map(([name, count]) => {
						const userEvent = rawData.find(
							(e: any) => e.embeds[0]?.author?.name === name,
						);
						const avatar = userEvent?.embeds[0]?.author?.iconURL || "";

						return {
							userName: name,
							userId: "N/A",
							avatar: avatar,
							contributions: count as number,
							contributionsText: "messages",
							isAdmin: false,
						};
					})
					.sort((a, b) => b.contributions - a.contributions);

				const data = {
					isModern: true,
					totalContributors: contributors.length,
					contributors: contributors,
					rawData: rawData,
				};

				this.setCachedData(dateString, data);
				return data;
			}
		} catch (error) {
			throw error;
		}
	}

	static extractAvatarUrl(avatarSource: string): string {
		if (!avatarSource)
			return "https://vignette.wikia.nocookie.net/messaging/images/1/19/Avatar.jpg";
		if (avatarSource.startsWith("http")) return avatarSource;
		const imgMatch = avatarSource.match(/src="([^"]+)"/);
		if (imgMatch && imgMatch[1]) {
			return imgMatch[1].replace(
				/width\/36\/height\/36/,
				"width/128/height/128",
			);
		}
		return "https://vignette.wikia.nocookie.net/messaging/images/1/19/Avatar.jpg";
	}

	static async getCurrentWeekDate(): Promise<string> {
		const urlParams = new URLSearchParams(window.location.search);
		const dateParam = urlParams.get("date");
		if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) return dateParam;

		await this.ensureAvailableFiles();
		if (this.availableFiles && this.availableFiles.size > 0) {
			const sortedDates = Array.from(this.availableFiles).sort().reverse();
			return sortedDates[0];
		}
		return this.formatDate(new Date());
	}

	static updateUrlWithDate(dateString: string): void {
		const url = new URL(window.location.href);
		url.searchParams.set("date", dateString);
		window.history.pushState({}, "", url.toString());
	}
}
