import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danielinniel Admin",
  description: "Manage Content",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
