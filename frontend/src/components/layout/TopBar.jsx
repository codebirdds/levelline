import { Link } from "react-router-dom";

const LINKS = [
  { label: "About Us",      to: "/about"    },
  { label: "Compare",       to: "/compare"  },
  { label: "Blog",          to: "/blog"     },
  { label: "FAQ",           to: "/faq"      },
  { label: "Contact Us",    to: "/contact"  },
];

export default function TopBar() {
  return (
    <div className="bg-brand text-white text-xs">
      <div className="container-x h-9 flex items-center justify-between">
        <div className="flex items-center gap-5">
          {LINKS.map((l) => (
            <Link key={l.label} to={l.to} className="hover:opacity-80">
              {l.label}
            </Link>
          ))}
          <span className="opacity-80 hidden md:inline">info@shopcart.com</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="hidden md:inline">USD · EN</span>
          <Link to="/track" className="hover:opacity-80">Order Tracking</Link>
        </div>
      </div>
    </div>
  );
}