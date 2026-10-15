import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReadyToWearThunk } from "./readyToWearThunks";
import {
  selectVisibleRtw, selectRtwLoading, selectRtwError,
  selectRtwCategory, selectRtwCategoryId, selectRtwSort,
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
  const category = useSelector(selectRtwCategory);       // display name
  const category_id = useSelector(selectRtwCategoryId);  // ← id passed to API
  const sort = useSelector(selectRtwSort);

  // Refetch when category_id or sort changes
  useEffect(() => {
    dispatch(fetchReadyToWearThunk({ category_id, sort }));
  }, [dispatch, category_id, sort]);

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
          <ProductGrid
            key={`${category_id ?? "all"}-${sort}`}
            products={products}
            editorial={editorial}
          />
        )}
      </section>

      <PersonaliseBanner />
      <LevellineWay />
    </main>
  );
}