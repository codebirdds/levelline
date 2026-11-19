import { useParams } from "react-router-dom";
import ConfiguratorView from "../components/ConfiguratorView.jsx";
import SectionHeading from "../../../components/common/SectionHeading";
import PillButton from "../../../components/common/PillButton";
import { ToastHost, toast } from "../ui/toast.jsx";
import { getProduct, getPublished } from "../storage/productStorage.js";
import { addToCart, buildCartItem } from "../storage/cartStorage.js";

export default function ProductCustomizer() {
  const { productId } = useParams();
  const product = getProduct(productId);
  const version = product ? getPublished(productId) : null;

  if (!product || !version) {
    return (
      <main className="min-h-[70vh] bg-page px-5 py-24 text-center">
        <SectionHeading title="Not available yet" subtitle="This garment hasn't been published for customisation. Please check back soon." />
        <PillButton href="/customize" className="mt-8">Browse garments</PillButton>
      </main>
    );
  }
  return (
    <main className="bg-white">
      <ConfiguratorView
        key={version.id}
        product={product}
        template={version.template}
        onAddToCart={({ selections, fabricId }) => {
          try {
            addToCart(buildCartItem(product, version, selections, fabricId));
            toast.success("Added to cart — your exact design is saved.");
          } catch (e) { toast.error(e.message); }
        }}
      />
      <ToastHost />
    </main>
  );
}
