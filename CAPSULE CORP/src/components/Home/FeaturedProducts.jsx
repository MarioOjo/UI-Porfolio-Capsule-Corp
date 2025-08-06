import { useState } from "react";

const featuredProducts = [
  {
    name: "Saiyan Battle Armor",
    img: "https://storage.googleapis.com/uxpilot-auth.appspot.com/2395797406-0b1495743d04eddc3fd5.png",
    desc: "Elite Saiyan combat gear with energy absorption technology",
    price: "$299",
    pl: "PL: 9000+",
    link: "/products/armor",
  },
  {
    name: "Gravity Chamber",
    img: "https://storage.googleapis.com/uxpilot-auth.appspot.com/43e28df86d-b72d92b389d88e498710.png",
    desc: "Train under extreme gravity conditions up to 500x Earth gravity",
    price: "$15,999",
    pl: "PL: 50000+",
    link: "/products/gravity-chamber",
  },
  {
    name: "Elite Scouter",
    img: "https://storage.googleapis.com/uxpilot-auth.appspot.com/2d967b598f-8cc6444dbec152dabcfa.png",
    desc: "Advanced power level detection with combat analysis",
    price: "$1,299",
    pl: "PL: 1M+",
    link: "/products/scouter",
  },
];

function FeaturedProducts({ onAddToCart }) {
  return (
    <section className="py-20 bg-white" id="products">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-gray-800 mb-4 font-sans">Featured Battle Gear</h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Equipment tested by the strongest warriors in the universe</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map(prod => (
            <div
              key={prod.name}
              className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-[#3B4CCA] transition-all transform hover:-translate-y-2"
            >
              <img className="h-64 w-full object-cover" src={prod.img} alt={prod.name} />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xl font-bold text-gray-800">{prod.name}</h4>
                  <span className="bg-[#00FF00] text-black px-3 py-1 text-sm font-bold rounded-full">{prod.pl}</span>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">{prod.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-[#3B4CCA]">{prod.price}</span>
                  <button
                    className="bg-[#3B4CCA] text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                    onClick={onAddToCart}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;