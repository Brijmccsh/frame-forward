import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

const marks = {
  sm: { px: 26, text: "text-base" },
  md: { px: 32, text: "text-lg" },
  lg: { px: 44, text: "text-2xl" },
};

export function Logo({
  href = "/",
  size = "md",
  showWordmark = true,
  className,
}: {
  href?: string | null;
  size?: keyof typeof marks;
  showWordmark?: boolean;
  className?: string;
}) {
  const { px, text } = marks[size];

  const content = (
    <>
      <Image
        src={BRAND.logoUrl}
        alt=""
        width={px}
        height={px}
        priority
        className="transition-transform duration-300 ease-soft group-hover:-rotate-6 group-hover:scale-105"
        style={{ width: px, height: "auto" }}
      />
      {showWordmark ? (
        <span
          className={cn(
            "font-head font-semibold lowercase tracking-tight text-text",
            text,
          )}
        >
          frame forward
        </span>
      ) : null}
      <span className="sr-only">{showWordmark ? "" : BRAND.name}</span>
    </>
  );

  const classes = cn("group inline-flex items-center gap-2.5", className);

  if (!href) {
    return <span className={classes}>{content}</span>;
  }

  return (
    <Link href={href} className={cn(classes, "rounded-md")} aria-label={BRAND.name}>
      {content}
    </Link>
  );
}
