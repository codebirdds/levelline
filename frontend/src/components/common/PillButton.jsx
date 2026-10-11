const VARIANTS = {
  dark: "border-border text-heading hover:bg-ink hover:border-ink hover:text-cream",
  light: "border-cream/70 text-cream hover:bg-cream hover:text-ink",
};
const SIZES = {
  sm: "px-6 py-2.5 text-xs",
  md: "px-8 py-3.5 text-sm",
};

export default function PillButton({
  href = "#",
  variant = "dark",
  size = "sm",
  className = "",
  children,
  color,
  ...rest
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-full border font-semibold uppercase tracking-wide transition ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}
