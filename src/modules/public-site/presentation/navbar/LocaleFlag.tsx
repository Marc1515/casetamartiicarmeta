import { Icon } from "@iconify/react";
import type { NavbarLocale } from "@/modules/public-site/presentation/navbar/navbar.config";

const FLAG_SIZE = 20;
const FLAG_SIZE_MOBILE = 28;
const CATALAN_FLAG_SCALE = 0.95;

function FlagCatalan({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center overflow-hidden rounded-full bg-[#FCDD09] align-middle leading-none ${className ?? ""}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 20 14" className="block h-full w-full">
        <rect width="20" height="14" fill="#FCDD09" />
        <rect y="2.33" width="20" height="1.56" fill="#DA121A" />
        <rect y="5.22" width="20" height="1.56" fill="#DA121A" />
        <rect y="8.11" width="20" height="1.56" fill="#DA121A" />
        <rect y="11" width="20" height="1.56" fill="#DA121A" />
      </svg>
    </span>
  );
}

type Props = {
  locale: NavbarLocale;
  className?: string;
  size?: "md" | "lg";
};

export default function LocaleFlag({ locale, className, size = "md" }: Props) {
  const resolvedSize = size === "lg" ? FLAG_SIZE_MOBILE : FLAG_SIZE;

  if (locale === "ca") {
    return (
      <FlagCatalan
        size={Math.round(resolvedSize * CATALAN_FLAG_SCALE)}
        className={className}
      />
    );
  }

  if (locale === "es") {
    return (
      <Icon
        icon="circle-flags:es"
        width={resolvedSize}
        height={resolvedSize}
        className={`align-middle leading-none ${className ?? ""}`}
        style={{ display: "block" }}
        aria-hidden
      />
    );
  }

  if (locale === "fr") {
    return (
      <Icon
        icon="circle-flags:fr"
        width={resolvedSize}
        height={resolvedSize}
        className={`align-middle leading-none ${className ?? ""}`}
        style={{ display: "block" }}
        aria-hidden
      />
    );
  }

  if (locale === "de") {
    return (
      <Icon
        icon="circle-flags:de"
        width={resolvedSize}
        height={resolvedSize}
        className={`align-middle leading-none ${className ?? ""}`}
        style={{ display: "block" }}
        aria-hidden
      />
    );
  }

  return (
    <Icon
      icon="circle-flags:gb"
      width={resolvedSize}
      height={resolvedSize}
      className={`align-middle leading-none ${className ?? ""}`}
      style={{ display: "block" }}
      aria-hidden
    />
  );
}
