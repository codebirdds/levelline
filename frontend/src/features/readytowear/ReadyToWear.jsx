import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReadyToWearThunk } from "./readyToWearThunks";
import {
  selectVisibleRtw, selectRtwLoading, selectRtwError, selectRtwCategory, selectRtwSort,
} from "./readyToWearSlice";
import RtwHero from "./components/RtwHero";
import RtwIntro from "./components/RtwIntro";
import FilterBar from "./components/FilterBar";
import ProductGrid from "./components/ProductGrid";
import PersonaliseBanner from "./components/PersonaliseBanner";
import LevellineWay from "./components/LevellineWay";

const Skeleton = () => (
  <div className="grid grid-cols-2 gap-1.5 px-4 lg:grid-cols-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="aspect-[3/4] animate-pulse bg-tile" />
    ))}
  </div>
);

export default function ReadyToWear() {
  const dispatch = useDispatch();
  const products = useSelector(selectVisibleRtw);
  const loading = useSelector(selectRtwLoading);
  const error = useSelector(selectRtwError);
  const category = useSelector(selectRtwCategory);
  const sort = useSelector(selectRtwSort);

  useEffect(() => { dispatch(fetchReadyToWearThunk()); }, [dispatch]);

  const editorial = category === "ALL" && sort === "featured";

  return (
    <main className="bg-[#f8f8f8]">
      <RtwHero />
      <RtwIntro />
      <FilterBar />

      <section className="pt-12 pb-10">
        {loading ? (
          <Skeleton />
        ) : error ? (
          <p className="px-4 py-24 text-center font-sans text-danger">{error}</p>
        ) : (
          // key => grid re-plays its reveal animation when the category/sort changes
          <ProductGrid key={`${category}-${sort}`} products={products} editorial={editorial} />
        )}
      </section>

      <PersonaliseBanner />
      <LevellineWay />
    </main>
  );
}
