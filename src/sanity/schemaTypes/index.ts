import { type SchemaTypeDefinition } from "sanity";

import { featuredType } from "./featuredType";
import { galleryType } from "./galleryType";
import { addressType } from "./objects/addressType";
import { categoryType } from "./categoryType";
import { productType } from "./productType";
import { orderType } from "./orderType";
import { storeSettingsType } from "./storeSettingsType";
import {
  shippingZoneCAType,
  shippingZoneGHType,
  shippingZoneZAType,
  shippingZoneKEType,
  shippingZoneGBType,
  shippingZoneNGType,
  shippingZoneUSType,
} from "./objects/shippingZoneTypes";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    featuredType,
    galleryType,
    addressType,
    categoryType,
    productType,
    orderType,
    storeSettingsType,
    shippingZoneNGType,
    shippingZoneUSType,
    shippingZoneCAType,
    shippingZoneGHType,
    shippingZoneZAType,
    shippingZoneKEType,
    shippingZoneGBType,
  ],
};
