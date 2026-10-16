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
        className={`font-sans font-medium text-3xl lg:text-4xl xl:text-[clamp(36px,2.81vw,40.5px)] ${
          light ? "text-cream" : "text-[#6b6b6b]"
        }`}
      >
        {title}
      </h2>
      {underline && (
        <span
          className={`mt-2 block h-px w-40 !bg-[#6b6b6b] bg-border lg:w-40 ${
            center ? "mx-auto" : ""
          }`}
        />
      )}
      {subtitle && (
        <p
          className={`mt-4 ${subtitleWidth} font-sans text-base lg:text-sm xl:mt-[clamp(16px,1.25vw,18px)] xl:text-[clamp(14px,1.09vw,15.8px)] ${
            light ? "text-cream" : "text-[#808080]"
          } ${center ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}