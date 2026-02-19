import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Danielinniel Studio")
    .items([
      S.documentTypeListItem("featured").title("Featured Works"),
      S.documentTypeListItem("gallery").title("Gallery"),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() && !["featured", "gallery"].includes(item.getId()!)
      ),
    ]);
