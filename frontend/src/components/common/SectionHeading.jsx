export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  underline = false,
  light = false,
  className = "",
  subtitleWidth = "max-w-lg",
}) {
  const center = align === "center";
  return (
    <div className={`${center ? "text-center" : ""} ${className}`}>
      <h2
        className={`font-sans font-medium text-3xl lg:text-4xl ${
          light ? "text-cream" : "text-[#6b6b6b]"}
        }`}
      >
        {title}
      </h2>
      {underline && (
        <span className={`mt-2 block h-px w-40 !bg-[#6b6b6b] bg-border lg:w-40 ${center ? "mx-auto" : ""}`} />
      )}
      {subtitle && (
        <p
          className={`mt-4 ${subtitleWidth} font-sans text-base lg:text-sm ${
            light ? "text-cream" : "text-[#808080]"
          } ${center ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
