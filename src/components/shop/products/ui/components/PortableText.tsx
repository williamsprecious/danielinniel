"use client";

import {
  PortableText as PT,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="leading-relaxed text-foreground/85">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-6 text-xl text-foreground">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-5 text-lg text-foreground">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-foreground/30 pl-4 italic text-foreground/75">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4 hover:text-foreground"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-5 text-foreground/85">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-5 text-foreground/85">{children}</ol>
    ),
  },
};

type PortableTextProps = {
  value: PortableTextBlock[];
};

const PortableText = ({ value }: PortableTextProps) => {
  if (!value?.length) return null;
  return (
    <div className="flex flex-col gap-3">
      <PT value={value} components={components} />
    </div>
  );
};

export default PortableText;
