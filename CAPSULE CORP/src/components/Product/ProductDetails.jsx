function ProductDetails() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">ELITE SCOUTER</h1>
        <div className="flex items-center space-x-3 mb-4">
          <span className="bg-neutral-600 text-white px-3 py-1 rounded text-sm">
            PL: 1,000,000+
          </span>
          <span className="bg-neutral-200 px-3 py-1 rounded text-sm">
            In Stock
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <span className="text-2xl line-through text-neutral-500">$1,599</span>
          <span className="text-3xl text-black">$1,299</span>
          <span className="bg-black text-white px-2 py-1 rounded text-sm">
            19% OFF
          </span>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm">Quantity:</span>
          <div className="flex items-center border rounded-lg">
            <button className="px-3 py-2 hover:bg-neutral-100">-</button>
            <span className="px-4 py-2 border-l border-r">1</span>
            <button className="px-3 py-2 hover:bg-neutral-100">+</button>
          </div>
        </div>
        <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-neutral-800 transition-colors">
          ADD TO CAPSULE
        </button>
        <div className="flex items-center space-x-2 text-sm text-neutral-600">
          <i className="fa-solid fa-rocket text-neutral-400"></i>
          <span>Instant Transmission Shipping Available</span>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;