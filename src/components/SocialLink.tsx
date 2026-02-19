import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { cn } from "@/lib/utils";

interface Props {
  href: string;
  icon: LucideIcon | IconType;
  className?: string;
}
export const SocialLink = ({ href, icon: Icon, className }: Props) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:scale-[1.4] transition-all duration-200"
    >
      <Icon className={cn("size-[15px] font-normal", className)} />
    </Link>
  );
};
