import "server-only";

import type { SanityClient } from "@sanity/client";
import type { PaystackOrderLine } from "../paystack/index";

type InventoryOrder = {
  _rev: string;
  adminNotes?: string;
  inventoryProcessedAt?: string;
};

type InventoryProduct = {
  _id: string;
  _rev: string;
  variants?: Array<{ _key: string }>;
};

export function appendOrderNotes(current: string | undefined, notes: string[]) {
  const existing = current ?? "";
  return [existing, ...notes.filter((note) => !existing.includes(note))]
    .filter(Boolean)
    .join("\n");
}

/** Only missing documents / revision conflicts are safe to retry immediately. */
function isConcurrentMutation(error: unknown) {
  const status = (error as { statusCode?: number } | null)?.statusCode;
  return status === 404 || status === 409;
}

/** Commit the stock changes and their completion marker together. */
export async function updateOrderInventory(
  client: SanityClient,
  orderId: string,
  lines: PaystackOrderLine[],
) {
  const physical = lines.filter((line) => line.type === "physical");
  if (physical.length === 0) return;

  // Re-read after concurrent deletion/editing. Other failures go back to Inngest.
  for (let attempt = 0; attempt < 3; attempt++) {
    const order = await client.getDocument<InventoryOrder>(orderId);
    if (!order) throw new Error("Order missing during inventory processing");
    if (order.inventoryProcessedAt) return;

    const ids = [
      ...new Set(physical.map((line) => line.productId).filter(Boolean)),
    ];
    const products = await client.getDocuments<InventoryProduct>(ids);
    const byId = new Map(
      products.flatMap((product) =>
        product ? [[product._id, product] as const] : [],
      ),
    );
    const notes: string[] = [];
    const changes = new Map<
      string,
      { product: InventoryProduct; amounts: Record<string, number> }
    >();
    let transaction = client.transaction();

    for (const line of physical) {
      const product = byId.get(line.productId);
      const missingVariant =
        line.variantKey &&
        !product?.variants?.some((variant) => variant._key === line.variantKey);
      if (!product || missingVariant) {
        notes.push(
          `Stock update skipped for ${line.title}${line.variantTitle ? ` (${line.variantTitle})` : ""} [${line.productId}]: ${!product ? "product" : "variant"} no longer exists. Review physical fulfillment manually.`,
        );
        continue;
      }
      const path = line.variantKey
        ? `variants[_key==${JSON.stringify(line.variantKey)}].stock`
        : "stock";
      const change = changes.get(product._id) ?? { product, amounts: {} };
      change.amounts[path] = (change.amounts[path] ?? 0) + line.qty;
      changes.set(product._id, change);
    }

    for (const { product, amounts } of changes.values()) {
      transaction = transaction.patch(product._id, (patch) =>
        patch.ifRevisionId(product._rev).dec(amounts),
      );
    }

    transaction = transaction.patch(orderId, (patch) =>
      patch.ifRevisionId(order._rev).set({
        inventoryProcessedAt: new Date().toISOString(),
        ...(notes.length
          ? { adminNotes: appendOrderNotes(order.adminNotes, notes) }
          : {}),
      }),
    );
    try {
      await transaction.commit();
      return;
    } catch (error) {
      if (attempt === 2 || !isConcurrentMutation(error)) throw error;
    }
  }
}

export function resolveDigitalDownloads(
  lines: PaystackOrderLine[],
  files: Array<{ _id: string; url: string | null }>,
  appUrl: string | undefined,
) {
  const byId = new Map(files.map((file) => [file._id, file.url]));
  const notes: string[] = [];
  const downloads = lines
    .filter((line) => line.type === "digital")
    .map((line) => {
      const url = byId.get(line.productId);
      if (url) return { title: line.title, url: `${url}?dl=` };

      // Use the actual homepage, without a download query string.
      const homepage = new URL("/", appUrl || "https://danielinniel.com").href;
      notes.push(
        `Manual digital delivery required for ${line.title} [${line.productId}]: no downloadable file was found. The email download link points to ${homepage}. Send the purchased file to the customer directly.`,
      );
      return { title: line.title, url: homepage };
    });
  return { downloads, notes };
}

/** Preserve staff notes and avoid duplicating a warning when Inngest retries. */
export async function recordOrderNotes(
  client: SanityClient,
  orderId: string,
  notes: string[],
) {
  if (notes.length === 0) return;
  for (let attempt = 0; attempt < 3; attempt++) {
    const order = await client.getDocument<InventoryOrder>(orderId);
    if (!order)
      throw new Error("Order missing while recording processing notes");
    const adminNotes = appendOrderNotes(order.adminNotes, notes);
    if (adminNotes === order.adminNotes) return;
    try {
      await client
        .patch(orderId)
        .ifRevisionId(order._rev)
        .set({ adminNotes })
        .commit();
      return;
    } catch (error) {
      if (attempt === 2 || !isConcurrentMutation(error)) throw error;
    }
  }
}
