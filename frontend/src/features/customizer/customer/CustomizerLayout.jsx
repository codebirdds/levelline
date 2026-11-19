import { Outlet } from "react-router-dom";
import CustomizerNav from "./CustomizerNav.jsx";

/** Layout for /customize, /customize/:id and /cart — its own light nav instead of the dark hero header. */
export default function CustomizerLayout() {
  return (
    <>
      <CustomizerNav />
      <Outlet />
    </>
  );
}
