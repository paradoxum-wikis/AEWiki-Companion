import type { GameDataCache, GameType } from "./types";

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_KEY_PREFIX = "tds_game_data_cache_";

function getCacheKey(gameType: GameType): string {
	return `${CACHE_KEY_PREFIX}${gameType}`;
}

export function saveToCache(data: GameDataCache): void {
	localStorage.setItem(getCacheKey(data.gameType), JSON.stringify(data));
}

export function getFromCache(gameType: GameType = "TDS"): GameDataCache | null {
	const cacheKey = getCacheKey(gameType);
	const cachedData = localStorage.getItem(cacheKey);
	if (!cachedData) return null;

	const parsedData: GameDataCache = JSON.parse(cachedData);

	if (Date.now() - parsedData.timestamp > CACHE_DURATION) {
		localStorage.removeItem(cacheKey);
		return null;
	}

	return parsedData;
}

export function clearCache(gameType?: GameType): void {
	if (gameType) {
		localStorage.removeItem(getCacheKey(gameType));
	} else {
		localStorage.removeItem(getCacheKey("TDS"));
		localStorage.removeItem(getCacheKey("AE"));
	}
}
