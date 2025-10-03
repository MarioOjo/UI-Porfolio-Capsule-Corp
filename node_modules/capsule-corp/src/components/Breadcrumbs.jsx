import { FaChevronRight } from "react-icons/fa";

function Breadcrumbs() {
  return (
    <div className="bg-neutral-50 py-3">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center space-x-2 text-sm text-neutral-600">
          <span className="hover:text-black cursor-pointer">Home</span>
          <FaChevronRight className="text-xs" />
          <span className="hover:text-black cursor-pointer">Battle Gear</span>
          <FaChevronRight className="text-xs" />
          <span className="text-black">Elite Scouter</span>
        </div>
      </div>
    </div>
  );
}

export default Breadcrumbs;