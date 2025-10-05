import { useCurrency } from '../../contexts/CurrencyContext';

function RelatedProducts() {
  const { formatPrice } = useCurrency();

  const products = [
    {
      name: "Battle Armor Set",
      price: 299,
      tag: "PL: 9000+",
      match: "85%",
      desc: "Saiyan Armor",
    },
    {
      name: "Weighted Training Gear",
      price: 899,
      tag: "PL: 15000+",
      match: "72%",
      desc: "Training Weights",
    },
    {
      name: "Healing Capsules",
      price: 49,
      tag: "RARE",
      match: "90%",
      desc: "Senzu Beans",
    },
  ];
  return (
    <section id="related-products">
      <h2 className="text-2xl mb-6">Z-WARRIOR ESSENTIALS</h2>
      <div className="grid grid-cols-3 gap-6">
        {products.map((prod) => (
          <div
            key={prod.name}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="h-32 bg-neutral-600 rounded mb-4 flex items-center justify-center">
              <span className="text-white text-sm">{prod.desc}</span>
            </div>
            <h3 className="text-lg mb-2">{prod.name}</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{formatPrice(prod.price)}</span>
              <span className="bg-neutral-600 text-white px-2 py-1 rounded text-xs">
                {prod.tag}
              </span>
            </div>
            <div className="text-sm text-neutral-600">
              Equipment Match: {prod.match}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RelatedProducts;