import type { StructureResolver } from "sanity/structure";
import {
  BasketIcon,
  BillIcon,
  CogIcon,
  PackageIcon,
  TagIcon,
} from "@sanity/icons";

const STORE_TYPES = ["product", "category", "order", "storeSettings"];
const TOP_LEVEL_TYPES = ["featured", "gallery", ...STORE_TYPES];

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Danielinniel Studio")
    .items([
      S.documentTypeListItem("featured").title("Featured Works"),
      S.documentTypeListItem("gallery").title("Gallery"),
      S.divider(),
      S.listItem()
        .title("Store")
        .icon(BasketIcon)
        .child(
          S.list()
            .title("Store")
            .items([
              S.documentTypeListItem("product")
                .title("Products")
                .icon(PackageIcon),
              S.documentTypeListItem("category")
                .title("Categories")
                .icon(TagIcon),
              S.documentTypeListItem("order")
                .title("Orders")
                .icon(BillIcon),
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
