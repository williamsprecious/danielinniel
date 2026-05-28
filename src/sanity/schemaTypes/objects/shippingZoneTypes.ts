import { defineArrayMember, defineField, defineType } from "sanity";
import {
  CA_PROVINCES,
  NG_STATES,
  US_STATES,
  type Region,
} from "@/lib/shipping/regions";

type CountryEntry = {
  /** Object type name used by `of: [{ type: ... }]`. */
  typeName: string;
  /** Friendly title shown in the "Add" menu. */
  title: string;
  /** ISO country code locked into the document. */
  code: "NG" | "US" | "CA" | "GB";
  /** Label for the region field (also drives the array title). */
  regionLabel: "State" | "Province" | null;
  /** Allowed regions, or null for flat-only countries. */
  regions: ReadonlyArray<Region> | null;
};

const buildOverrideMember = (entry: CountryEntry) =>
  defineArrayMember({
    type: "object",
    name: `${entry.typeName}Override`,
    title: `${entry.regionLabel} Override`,
    fields: [
      defineField({
        name: "region",
        title: entry.regionLabel ?? "Region",
        type: "string",
        options: {
          list: (entry.regions ?? []).map((r) => ({
            title: r.name,
            value: r.name,
          })),
          layout: "dropdown",
        },
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: "feeNGN",
        title: "Fee (NGN)",
        type: "number",
        description: "Set 0 for free shipping in this region.",
        validation: (Rule) => Rule.required().min(0),
      }),
    ],
    preview: {
      select: { region: "region", feeNGN: "feeNGN" },
      prepare: ({ region, feeNGN }) => ({
        title: region || (entry.regionLabel ?? "Region"),
        subtitle:
          typeof feeNGN === "number"
            ? feeNGN === 0
              ? "Free"
              : `₦${feeNGN.toLocaleString()}`
            : "—",
      }),
    },
  });

const buildZoneType = (entry: CountryEntry) =>
  defineType({
    name: entry.typeName,
    title: entry.title,
    type: "object",
    fields: [
      defineField({
        name: "country",
        title: "Country",
        type: "string",
        initialValue: entry.code,
        readOnly: true,
        hidden: true,
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: "defaultFeeNGN",
        title: "Default Fee (NGN)",
        type: "number",
        description:
          "Applied to any address in this country with no matching region override. Set 0 for free shipping.",
        validation: (Rule) => Rule.required().min(0),
      }),
      ...(entry.regions
        ? [
            defineField({
              name: "regionOverrides",
              title: `${entry.regionLabel} Overrides`,
              type: "array",
              description: `Optional per-${(entry.regionLabel ?? "region").toLowerCase()} fees. Any ${(
                entry.regionLabel ?? "region"
              ).toLowerCase()} not listed here uses the default fee above.`,
              of: [buildOverrideMember(entry)],
              validation: (Rule) =>
                Rule.custom((items) => {
                  const list = items as
                    | Array<{ region?: string }>
                    | undefined;
                  if (!list || list.length === 0) return true;
                  const seen = new Set<string>();
                  const dups = new Set<string>();
                  for (const o of list) {
                    if (!o?.region) continue;
                    const key = o.region.trim().toLowerCase();
                    if (seen.has(key)) dups.add(o.region);
                    seen.add(key);
                  }
                  return dups.size === 0
                    ? true
                    : `Duplicate ${(entry.regionLabel ?? "region").toLowerCase()}s: ${[
                        ...dups,
                      ].join(", ")}`;
                }),
            }),
          ]
        : []),
    ],
    preview: {
      select: {
        defaultFeeNGN: "defaultFeeNGN",
        overrides: "regionOverrides",
      },
      prepare: ({ defaultFeeNGN, overrides }) => {
        const fee =
          typeof defaultFeeNGN === "number"
            ? defaultFeeNGN === 0
              ? "Free"
              : `₦${defaultFeeNGN.toLocaleString()}`
            : "—";
        const overrideCount = Array.isArray(overrides) ? overrides.length : 0;
        const overrideSuffix = entry.regions
          ? ` • ${overrideCount} ${(entry.regionLabel ?? "region")
              .toLowerCase()} override${overrideCount === 1 ? "" : "s"}`
          : "";
        return {
          title: entry.title,
          subtitle: `Default: ${fee}${overrideSuffix}`,
        };
      },
    },
  });

export const shippingZoneNGType = buildZoneType({
  typeName: "shippingZoneNG",
  title: "Nigeria",
  code: "NG",
  regionLabel: "State",
  regions: NG_STATES,
});

export const shippingZoneUSType = buildZoneType({
  typeName: "shippingZoneUS",
  title: "United States",
  code: "US",
  regionLabel: "State",
  regions: US_STATES,
});

export const shippingZoneCAType = buildZoneType({
  typeName: "shippingZoneCA",
  title: "Canada",
  code: "CA",
  regionLabel: "Province",
  regions: CA_PROVINCES,
});

export const shippingZoneGBType = buildZoneType({
  typeName: "shippingZoneGB",
  title: "United Kingdom",
  code: "GB",
  regionLabel: null,
  regions: null,
});
