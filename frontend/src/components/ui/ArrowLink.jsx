import SmartLink from "../common/SmartLink";

export default function ArrowLink({ href = "#", children, light = false, className = "" ,lightColor = "#6b6b6b",lightHoverColor = "#675127" ,hoverBold = false}) {
  return (
    <SmartLink
      href={href}
      className={`inline-flex items-center gap-3 border-b pb-1.5
         font-sans text-sm font-medium transition 
         ${hoverBold ? "hover:font-bold" : ""}
         hover:border-gold hover:text-[${lightHoverColor}] lg:text-sm ${
        light ? `border-cream/60 text-[${lightColor}]` : `border-border text-[${lightColor}]`
      } ${className}`}
    >
      {children}
      <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 6h16M12 1l5 5-5 5" />
      </svg>
    </SmartLink>
  );
}
