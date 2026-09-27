import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsThunk } from "../products/productThunks";
import { selectProducts, selectProductsLoading } from "../products/productSlice";
import { HeroBanner, ProductSection } from "./components";
import Spinner from "../../components/common/Spinner";

export default function Home() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProductsThunk());
  }, [dispatch, products.length]);

  return (
    <div className="pb-16">
      <HeroBanner />

      <div className="container-x">
        {loading ? (
          <Spinner full />
        ) : (
          <>
            <ProductSection title="Headphones For You!" products={products.slice(0, 10)} />
            <ProductSection title="Trending Now"        products={products.slice(10, 20)} />
            <ProductSection title="Recommended"         products={products.slice(20, 30)} />
          </>
        )}
      </div>
    </div>
  );
}