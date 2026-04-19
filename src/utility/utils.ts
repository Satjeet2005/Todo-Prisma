import client from "./Redis.ts";

export const convertURLToRedisKey = (baseUrl: string, query: any) => {
  const serializedQuery = Object.keys(query)
    .sort()
    .map((key) => {
      const value = query[key].toLowerCase();
      return `${key}=${value}`;
    })
    .join("&");
  const serializedBaseUrl = baseUrl.slice(1).replace("/", ":");
  const key = `${serializedBaseUrl}?${serializedQuery}`;
  return key;
};

export const scanAndDeleteKey = async (pattern: string) => {
  let cursor = "0";

  do {
    const { cursor: nextCursor, keys } = await client.scan(cursor, {
      MATCH: pattern,
    });

    if (keys.length > 0) {
      await client.del(keys);
    }

    cursor = nextCursor;
  } while (cursor !== "0");
};
