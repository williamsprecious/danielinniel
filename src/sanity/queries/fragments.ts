// Shared GROQ fragments. Pulled out so the same projection logic is
// defined once and the reference resolutions (`->`) collapse into a
// single subquery per image rather than one per field.

export const productImageFields = /* groq */ `
  ...,
  ...asset->{
    "width": metadata.dimensions.width,
    "height": metadata.dimensions.height,
    "lqip": metadata.lqip
  }
`;
