import { Link } from "react-router-dom";

/** "/path" or "/#hash" => client-side <Link>. "#hash" or external => normal <a>. */
export default function SmartLink({ href = "#", children, ...rest }) {
  const internal = typeof href === "string" && href.startsWith("/");
  return internal ? (
    <Link to={href} {...rest}>{children}</Link>
  ) : (
    <a href={href} {...rest}>{children}</a>
  );
}
