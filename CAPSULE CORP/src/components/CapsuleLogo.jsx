import { FaCapsules } from "react-icons/fa";
function CapsuleLogo() {
  return (
    <div className="flex items-center justify-center space-x-4 mb-3">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-lg">
        <FaCapsules className="text-white text-2xl" />
      </div>
      <h1 className="text-4xl font-saiyan font-black text-white tracking-wider">CAPSULE CORP.</h1>
    </div>
  );
}
export default CapsuleLogo;