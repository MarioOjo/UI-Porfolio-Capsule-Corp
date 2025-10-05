import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";

function Specifications() {
  const specs = [
    { icon: <FaCheckCircle className="text-neutral-600" />, text: "Target Lock System" },
    { icon: <FaTimesCircle className="text-neutral-600" />, text: "Cracked Lens (Cosmetic)" },
    { icon: <FaExclamationTriangle className="text-neutral-600" />, text: "May Attract Frieza's Forces" },
    { icon: <FaCheckCircle className="text-neutral-600" />, text: "Multi-Language Support" },
  ];
  return (
    <section className="mt-16 space-y-12" id="specifications">
      <h2 className="text-2xl mb-6">SAIYAN TECH SPECIFICATIONS</h2>
      <div className="bg-neutral-50 p-6 rounded-lg">
        <p className="text-neutral-700 mb-6">
          This Elite Scouter was salvaged from the remains of Frieza's elite forces during the Namek invasion. 
          Featuring advanced power level detection capabilities and combat analysis systems, this device has been 
          battle-tested across multiple planetary conflicts.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {specs.map((spec) => (
            <div key={spec.text} className="flex items-center space-x-3">
              {spec.icon}
              <span>{spec.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Specifications;