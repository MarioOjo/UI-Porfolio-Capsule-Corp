import { Link } from "react-router-dom";

const battleGearProducts = [
  { name: "Saiyan Armor", pl: "PL: 9,000", price: "$299", status: "Available" },
  { name: "Weighted Training Gear", pl: "PL: 15,000", price: "$899", status: "Available" },
  { name: "Power Pole", pl: "PL: 7,500", price: "$499", status: "Available" },
  { name: "Energy Sword", pl: "PL: 12,000", price: "$1,299", status: "Available" },
  { name: "Scouter", pl: "PL: 1,000,000+", price: "$1,299", status: "Available" },
  { name: "Battle Boots", pl: "PL: 3,000", price: "$199", status: "Available" },
  { name: "Saiyan Gloves", pl: "PL: 2,500", price: "$149", status: "Available" },
  { name: "Android Barrier", pl: "PL: 20,000", price: "$2,499", status: "Available" },
  { name: "Majin Cape", pl: "PL: 8,000", price: "$399", status: "Available" },
  { name: "Namekian Wristbands", pl: "PL: 5,000", price: "$249", status: "Available" },
];

function BattleGear({ cartCount, setCartCount }) {
  const handleAddToCart = () => setCartCount(count => count + 1);

  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
      <h1 className="text-4xl font-saiyan text-[#3B4CCA] mb-8">Battle Gear</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {battleGearProducts.map(item => (
          <div key={item.name} className="bg-white border-2 border-dashed border-[#3B4CCA] rounded-lg p-6 hover:shadow-xl hover:border-[#FF9E00] transition-all">
            <div className="w-full h-32 bg-[#3B4CCA] rounded mb-3 flex items-center justify-center border-2 border-[#FF9E00] relative">
              <span className="text-white text-xs font-bold">{item.name}</span>
              <div className="absolute inset-0 bg-[#FF9E00] opacity-10 rounded"></div>
            </div>
            <h4 className="mb-2 text-[#3B4CCA] font-bold">{item.name}</h4>
            <div className="flex items-center space-x-1 mb-2">
              <span className="bg-[#3B4CCA] text-white px-2 py-1 rounded text-xs">{item.pl}</span>
              <span className="text-[#00FF00]">🟢</span>
            </div>
            <div className="text-lg mb-3 text-[#FF9E00] font-bold">{item.price}</div>
            <button
              className="w-full py-2 rounded text-sm transition-all shadow bg-gradient-to-r from-[#3B4CCA] to-[#FF9E00] text-white hover:from-[#FF9E00] hover:to-[#3B4CCA] hover:text-black"
              type="button"
              onClick={handleAddToCart}
            >
              Add to Capsule
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default BattleGear;