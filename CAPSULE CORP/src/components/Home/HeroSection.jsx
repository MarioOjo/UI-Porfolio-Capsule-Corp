import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-[#FF9E00] via-orange-400 to-red-500 h-[600px] relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-12 gap-8 items-center h-full">
          <div className="col-span-7">
            <div className="space-y-8">
              <h2 className="text-6xl font-black text-white leading-tight drop-shadow-2xl font-sans">SUMMER SAIYAN SALE</h2>
              <p className="text-xl text-white/90 font-medium leading-relaxed drop-shadow-lg">
                Power up your training with legendary gear! Up to 50% off battle equipment and capsule technology.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/products"
                  className="bg-white text-[#3B4CCA] px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  Shop Now
                </Link>
                <Link
                  to="/battle-gear"
                  className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-[#3B4CCA] transition-all shadow-xl"
                >
                  View Collection
                </Link>
              </div>
              <div className="flex items-center space-x-6 pt-6">
                <div className="flex space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#FF9E00] rounded-full shadow-lg border-2 border-white"></div>
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg border-2 border-white"></div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-[#3B4CCA] rounded-full shadow-lg border-2 border-white"></div>
                </div>
                <span className="text-white/90 font-medium drop-shadow">Collect all 7 Dragon Balls</span>
              </div>
            </div>
          </div>
          <div className="col-span-5">
            <div className="relative">
              <img
                className="w-full h-96 rounded-2xl shadow-2xl border-4 border-white/20 object-cover"
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/df5468d5f3-d0e515adcc93a2193bb1.png"
                alt="Goku riding golden nimbus cloud"
              />
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FF9E00] rounded-full shadow-xl border-4 border-white animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-xl border-4 border-white animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;