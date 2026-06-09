"use client";

import {
  PortableText as PT,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";

const components: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href ?? "#"} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};

type PortableTextProps = {
  value: PortableTextBlock[];
};

const PortableText = ({ value }: PortableTextProps) => {
  if (!value?.length) return null;
  return (
    <div className="prose lg:prose-lg">
      <PT value={value} components={components} />
    </div>
  );
};

export default PortableText;
