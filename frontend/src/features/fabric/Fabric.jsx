import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchFabricThunk } from "./fabricThunks";
import FabricHero from "./components/FabricHero";
import FabricCategories from "./components/FabricCategories";
import FabricGrid from "./components/FabricGrid";

export default function Fabric() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFabricThunk());
  }, [dispatch]);

  return (
    <main className="bg-white">
      <FabricHero />
      <FabricCategories />
      <FabricGrid />
    </main>
  );
}