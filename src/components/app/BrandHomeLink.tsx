import Link from "next/link";

export function BrandHomeLink({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="FindYourTow home" className={`flex items-center ${className}`.trim()}>
      <img
        src="/brand/findyourtow-header-lockup.png"
        alt="FindYourTow brand lockup"
        className="h-14 w-[13.25rem] object-contain object-left drop-shadow-[0_0_22px_rgba(56,189,248,0.24)] sm:w-[15rem]"
      />
      <span className="sr-only">FindYourTow</span>
    </Link>
  );
}
