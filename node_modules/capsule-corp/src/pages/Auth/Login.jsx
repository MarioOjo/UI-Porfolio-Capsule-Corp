// ...existing code...
import { useState } from "react";
import { FaGlasses, FaEye } from "react-icons/fa";
import { useAuth } from "../../AuthContext"; // add
import { useNavigate } from "react-router-dom"; // add
import { useNotifications } from "../../contexts/NotificationContext";
import GoogleSignInButton from "../../components/GoogleSignInButton";

function Login({ onSwitchTab }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // add
  const { login } = useAuth(); // add
  const navigate = useNavigate(); // add
  const { showSuccess, showError } = useNotifications();

  function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  async function handleLogin(e) { // make async
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both Scouter ID and Battle Password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password); // call backend via AuthContext
      showSuccess("🔥 Power level rising! Welcome back, Saiyan!", {
        title: "LOGIN SUCCESSFUL",
        duration: 4000
      });
      navigate("/");
    } catch (err) {
      const errorMessage = err?.message || "Login failed";
      setError(errorMessage);
      showError(`⚡ ${errorMessage}`, {
        title: "LOGIN FAILED",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-7">
      {/* Google Sign-In Button */}
      <GoogleSignInButton variant="primary" />
      
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-saiyan tracking-wide">
            OR USE SCOUTER ID
          </span>
        </div>
      </div>

      {/* Regular Login Form */}
      <form className="space-y-7" onSubmit={handleLogin}>
        <div>
        <label className="block text-sm font-saiyan text-gray-600 mb-3 tracking-wide">
          SCOUTER ID
        </label>
        <div className="relative">
          <FaGlasses className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-lg" />
          <input
            type="email"
            placeholder="Enter your Capsule Corp. ID"
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all font-saiyan"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-saiyan text-gray-600 mb-3 tracking-wide">
          BATTLE PASSWORD
        </label>
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Your battle password"
            className="w-full pl-4 pr-14 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all font-saiyan"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
            onClick={() => setShowPass(s => !s)}
            tabIndex={-1}
          >
            <FaEye />
          </button>
        </div>
      </div>
      {error && (
        <div className="text-red-600 text-sm font-medium shake">{error}</div>
      )}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white py-4 rounded-xl font-saiyan font-bold text-lg kamehameha-glow transition-all hover:scale-105 hover:shadow-xl"
        disabled={loading}
      >
        {loading ? "Signing in..." : "POWER UP"}
      </button>
      <div className="text-center space-y-3">
        <div>
          <span className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm font-medium transition-colors">
            Use the Dragon Balls! (Forgot Password?)
          </span>
        </div>
        <div>
          <span className="text-gray-600">No Scouter? </span>
          <span
            className="text-blue-600 hover:text-orange-400 cursor-pointer font-semibold transition-colors"
            onClick={onSwitchTab}
          >
            SIGN UP
          </span>
        </div>
      </div>
      </form>
    </div>
  );
}

export default Login;