function ProductGallery() {
  const views = ["View 1", "View 2", "View 3", "View 4"];
  return (
    <div className="relative">
      <div className="w-full h-96 bg-neutral-600 rounded-xl flex items-center justify-center relative overflow-hidden">
        <span className="text-white text-xl">Elite Scouter Device</span>
        <div className="absolute top-4 right-4 bg-neutral-600 text-white px-3 py-1 rounded text-sm">
          PL: 1,000,000+
        </div>
        <div className="absolute inset-0 border-4 border-neutral-400 rounded-xl opacity-50"></div>
      </div>
      <div className="flex space-x-2 mt-4">
        {views.map((view) => (
          <div
            key={view}
            className="w-20 h-20 bg-neutral-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-neutral-400"
          >
            <span className="text-white text-xs">{view}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductGallery;