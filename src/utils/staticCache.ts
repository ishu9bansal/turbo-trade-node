type CacheStore = Record<string, any>;

const staticCache: CacheStore = {};

export const getCachedOrFetch = async (
    key: string,
    fetchFn: () => Promise<any>
): Promise<any> => {
    if (key in staticCache) {
        console.log(`[Cache] Hit for ${key}`);
        return staticCache[key];
    }

    console.log(`[Cache] Miss for ${key}. Fetching...`);
    const data = await fetchFn();
    staticCache[key] = data;
    return data;
};
