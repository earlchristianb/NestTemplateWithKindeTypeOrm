export function makeTitleCase(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function parseSkipLimit(skip: string, limit: string) {
  const parsedSkip = parseInt(skip, 10) || 0;
  const parsedLimit =
    limit === 'all' ? Number.MAX_SAFE_INTEGER : parseInt(limit, 10) || 10;
  return { parsedSkip, parsedLimit };
}
