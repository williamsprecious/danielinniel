/** Snapshot the selected values before a variant can be edited or deleted. */
export function formatVariantLabel(
  options: ReadonlyArray<{ name?: string | null }> | null | undefined,
  values: ReadonlyArray<string | null> | null | undefined,
  fallback: string | null = null,
): string | null {
  const parts = (values ?? []).flatMap((value, index) => {
    if (!value?.trim()) return [];
    const name = options?.[index]?.name?.trim();
    return [name ? `${name}: ${value.trim()}` : value.trim()];
  });
  return parts.length ? parts.join(" / ") : fallback;
}
