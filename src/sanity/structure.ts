import type { Template } from "sanity";
import type { StructureResolver } from "sanity/structure";
import { BasketIcon } from "@sanity/icons/Basket";
import { BillIcon } from "@sanity/icons/Bill";
import { CogIcon } from "@sanity/icons/Cog";
import { ImagesIcon } from "@sanity/icons/Images";
import { PackageIcon } from "@sanity/icons/Package";
import { TagIcon } from "@sanity/icons/Tag";
import { apiVersion } from "./env";

const STORE_TYPES = ["product", "category", "order", "storeSettings"];
const TOP_LEVEL_TYPES = ["featured", "gallery", ...STORE_TYPES];
const GALLERY_CATEGORY_GROUPS = [
  {
    title: "Cover Art",
    category: "cover-art",
    field: "grade",
    options: [
      { title: "Essential", value: "essential" },
      { title: "Advanced", value: "advanced" },
    ],
  },
  {
    title: "Concept & Design",
    category: "concept-and-design",
    field: "conceptType",
    options: [
      { title: "Concept Art", value: "concept-art" },
      { title: "Logo", value: "logo" },
      { title: "Character Design", value: "character-design" },
      { title: "Fashion Illustration", value: "fashion-illustration" },
    ],
  },
] as const;
const PRODUCT_STATUS_GROUPS = [
  { title: "Draft Products", status: "draft" },
  { title: "Active Products", status: "active" },
  { title: "Archived Products", status: "archived" },
];
const ORDER_STATUS_GROUPS = [
  { title: "Confirmed Orders", status: "confirmed" },
  { title: "Processing Orders", status: "processing" },
  { title: "Delivered Orders", status: "delivered" },
  { title: "Cancelled Orders", status: "cancelled" },
  { title: "Refunded Orders", status: "refunded" },
];

export const groupedInitialValueTemplates: Template[] = [
  ...GALLERY_CATEGORY_GROUPS.flatMap(({ title, category, field, options }) => [
    {
      id: `gallery-${category}`,
      title,
      schemaType: "gallery",
      value: { category },
    },
    ...options.map(({ title: label, value }) => ({
      id: `gallery-${category}-${value}`,
      title: `${title}: ${label}`,
      schemaType: "gallery",
      value: { category, [field]: value },
    })),
  ]),
  ...PRODUCT_STATUS_GROUPS.map(({ title, status }) => ({
    id: `product-${status}`,
    title,
    schemaType: "product",
    value: { status },
  })),
];

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Danielinniel Studio")
    .items([
      S.documentTypeListItem("featured").title("Featured Works"),
      S.listItem()
        .id("gallery")
        .title("Gallery")
        .icon(ImagesIcon)
        .child(
          S.list()
            .title("Gallery")
            .items([
              S.documentTypeListItem("gallery")
                .id("all-gallery-items")
                .title("All Gallery Items")
                .child(
                  S.documentTypeList("gallery")
                    .title("All Gallery Items")
                    .initialValueTemplates([S.initialValueTemplateItem("gallery")])
                ),
              ...GALLERY_CATEGORY_GROUPS.map(({ title, category, field, options }) =>
                S.listItem()
                  .id(category)
                  .title(title)
                  .schemaType("gallery")
                  .child(
                    S.list()
                      .title(title)
                      .items([
                        S.listItem()
                          .id(`all-${category}`)
                          .title(`All ${title}`)
                          .schemaType("gallery")
                          .child(
                            S.documentTypeList("gallery")
                              .title(`All ${title}`)
                              .apiVersion(apiVersion)
                              .filter('_type == "gallery" && category == $category')
                              .params({ category })
                              .initialValueTemplates([
                                S.initialValueTemplateItem(`gallery-${category}`),
                              ])
                          ),
                        ...options.map(({ title: label, value }) =>
                          S.listItem()
                            .id(`${category}-${value}`)
                            .title(label)
                            .schemaType("gallery")
                            .child(
                              S.documentTypeList("gallery")
                                .title(`${title}: ${label}`)
                                .apiVersion(apiVersion)
                                .filter(
                                  `_type == "gallery" && category == $category && ${field} == $value`
                                )
                                .params({ category, value })
                                .initialValueTemplates([
                                  S.initialValueTemplateItem(
                                    `gallery-${category}-${value}`
                                  ),
                                ])
                            )
                        ),
                      ])
                  )
              ),
            ])
        ),
      S.divider(),
      S.listItem()
        .title("Store")
        .icon(BasketIcon)
        .child(
          S.list()
            .title("Store")
            .items([
              S.listItem()
                .id("product")
                .title("Products")
                .icon(PackageIcon)
                .child(
                  S.list()
                    .title("Products")
                    .items([
                      S.documentTypeListItem("product")
                        .id("all-products")
                        .title("All Products")
                        .child(
                          S.documentTypeList("product")
                            .title("All Products")
                            .initialValueTemplates([
                              S.initialValueTemplateItem("product"),
                            ])
                        ),
                      ...PRODUCT_STATUS_GROUPS.map(({ title, status }) =>
                        S.listItem()
                          .id(`${status}-products`)
                          .title(title)
                          .schemaType("product")
                          .child(
                            S.documentTypeList("product")
                              .title(title)
                              .apiVersion(apiVersion)
                              .filter('_type == "product" && status == $status')
                              .params({ status })
                              .initialValueTemplates([
                                S.initialValueTemplateItem(`product-${status}`),
                              ])
                          )
                      ),
                    ])
                ),
              S.documentTypeListItem("category")
                .title("Categories")
                .icon(TagIcon),
              S.listItem()
                .id("order")
                .title("Orders")
                .icon(BillIcon)
                .child(
                  S.list()
                    .title("Orders")
                    .items([
                      S.documentTypeListItem("order")
                        .id("all-orders")
                        .title("All Orders")
                        .child(
                          S.documentTypeList("order").title("All Orders")
                        ),
                      ...ORDER_STATUS_GROUPS.map(({ title, status }) =>
                        S.listItem()
                          .id(`${status}-orders`)
                          .title(title)
                          .schemaType("order")
                          .child(
                            S.documentTypeList("order")
                              .title(title)
                              .apiVersion(apiVersion)
                              .filter('_type == "order" && status == $status')
                              .params({ status })
                          )
                      ),
                    ])
                ),
              S.divider(),
              S.listItem()
                .title("Store Settings")
                .icon(CogIcon)
                .child(
                  S.document()
                    .schemaType("storeSettings")
                    .documentId("storeSettings")
                    .title("Store Settings")
                ),
            ])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !TOP_LEVEL_TYPES.includes(item.getId()!)
      ),
    ]);
