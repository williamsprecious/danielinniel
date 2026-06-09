import { Instagram } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io5";
import { SocialLink } from "./SocialLink";
import CurrencySwitcher from "./CurrencySwitcher";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="row-container bg-background flex flex-col gap-6 items-center py-10 border-t border-solid md:flex-row md:justify-between md:py-6">
      <div className="flex gap-5 opacity-90 md:gap-6">
        <SocialLink
          href="https://www.instagram.com/danielinniel"
          icon={Instagram}
          className="size-4"
        />
        <SocialLink
          href="https://x.com/danielinniel"
          icon={FaXTwitter}
          className="size-4"
        />
        <SocialLink
          href="https://www.tiktok.com/@innielsden"
          icon={FaTiktok}
          className="size-4"
        />
        <SocialLink
          href="https://www.youtube.com/@danielinniel"
          icon={IoLogoYoutube}
          className="size-4"
        />
      </div>

      <p className="max-md:mt-2 text-[13px] font-light opacity-70 md:text-sm md:opacity-80">
        &copy; Danielinniel {currentYear}
      </p>

      <CurrencySwitcher />
    </footer>
  );
};

export default Footer;
