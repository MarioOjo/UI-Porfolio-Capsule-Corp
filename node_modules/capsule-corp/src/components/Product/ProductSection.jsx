import ProductGallery from "./ProductGallery";
import ProductDetails from "./ProductDetails";

function ProductSection() {
  return (
    <section className="grid grid-cols-12 gap-8">
      <div className="col-span-7">
        <ProductGallery />
      </div>
      <div className="col-span-5">
        <ProductDetails />
      </div>
    </section>
  );
}

export default ProductSection;