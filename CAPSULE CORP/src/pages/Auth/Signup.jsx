// ...existing code...
import { useState } from "react";
import { FaUser, FaGlasses, FaEye } from "react-icons/fa";
import { useAuth } from "../../AuthContext"; // <<-- fixed path (was "../../../AuthContext")
import { useNavigate } from "react-router-dom";

function Signup({ onSwitchTab }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [promo, setPromo] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function passwordStrength(pw) {
    if (pw.length < 4) return "Weak";
    if (pw.length < 8) return "Medium";
    return "Strong";
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (passwordStrength(password) === "Weak") {
      setError("Password is too weak. Use at least 4 characters.");
      return;
    }

    setLoading(true);
    try {
      await signup(email, password);
      navigate("/");
    } catch (err) {
      setError(err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  const strength = Math.min(Math.floor(password.length / 2), 5);

  return (
    <form className="space-y-7" onSubmit={handleSignup}>
      <div>
        <label className="block text-sm font-saiyan text-blue-700 mb-3 tracking-wide">
          EARTHLING NAME
        </label>
        <div className="relative">
          <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
          <input
            type="text"
            placeholder="Your Earthling Name"
            className="w-full pl-12 pr-4 py-4 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-saiyan"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-saiyan text-blue-700 mb-3 tracking-wide">
          SCOUTER ID (EMAIL)
        </label>
        <div className="relative">
          <FaGlasses className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
          <input
            type="email"
            placeholder="user@capsulecorp.com"
            className="w-full pl-12 pr-4 py-4 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-saiyan"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-saiyan text-blue-700 mb-3 tracking-wide">
          BATTLE PASSWORD
        </label>
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Create your battle password"
            className="w-full pl-4 pr-14 py-4 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-saiyan"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={4}
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 hover:text-orange-500"
            onClick={() => setShowPass(s => !s)}
            tabIndex={-1}
          >
            <FaEye />
          </button>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-xs font-saiyan text-gray-600 tracking-wide">
            POWER LEVEL:
          </span>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-6 h-3 rounded-full ${
                  i < strength
                    ? strength <= 2
                      ? "bg-red-500 power-bar active"
                      : strength <= 4
                      ? "bg-orange-500 power-bar active"
                      : "bg-green-500 power-bar active"
                    : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>
        <span className="text-xs text-red-500 font-medium">
          {strength < 2
            ? "Weak (PL<2000)"
            : strength < 4
            ? "Medium (PL<5000)"
            : "Strong (PL>9000)"}
        </span>
      </div>
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          className="mt-1.5 w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-600"
          checked={promo}
          onChange={e => setPromo(e.target.checked)}
          id="promo"
        />
        <label htmlFor="promo" className="text-sm text-gray-600 font-sans">
          <span className="text-blue-600 font-semibold">Capsule Delivery:</span>{" "}
          Send me Senzu Bean deals!
        </label>
      </div>
      {error && (
        <div className="text-red-600 text-sm font-medium shake">{error}</div>
      )}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white py-4 rounded-xl font-saiyan font-bold text-lg kamehameha-glow transition-all hover:scale-105 hover:shadow-xl"
        disabled={loading}
      >
        {loading ? "Creating..." : "CREATE ACCOUNT"}
      </button>
      <div className="text-center">
        <span className="text-gray-600">Already have a Scouter? </span>
        <span
          className="text-blue-600 hover:text-orange-400 cursor-pointer font-semibold transition-colors"
          onClick={onSwitchTab}
        >
          LOGIN
        </span>
      </div>
    </form>
  );
}

export default Signup;
// ...existing code...