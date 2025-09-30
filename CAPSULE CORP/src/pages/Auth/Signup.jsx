// ...existing code...
import { useState } from "react";
import { FaUser, FaGlasses, FaEye } from "react-icons/fa";
import { useAuth } from "../../AuthContext"; // <<-- fixed path (was "../../../AuthContext")
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../contexts/NotificationContext";
import GoogleSignInButton from "../../components/GoogleSignInButton";

function Signup({ onSwitchTab }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [promo, setPromo] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();

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
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (passwordStrength(password) === "Weak") {
      setError("Password is too weak. Use at least 4 characters.");
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, firstName, lastName);
      showSuccess("🎉 Scouter activated! Your Capsule Corp. account is ready!", {
        title: "ACCOUNT CREATED",
        duration: 4000
      });
      navigate("/");
    } catch (err) {
      const errorMessage = err?.message || "Signup failed";
      setError(errorMessage);
      showError(`⚡ ${errorMessage}`, {
        title: "SIGNUP FAILED",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  }

  const strength = Math.min(Math.floor(password.length / 2), 5);

  return (
    <div className="space-y-7">
      {/* Google Sign-In Button */}
      <GoogleSignInButton variant="secondary" />
      
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-blue-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-blue-500 font-saiyan tracking-wide">
            OR CREATE NEW ACCOUNT
          </span>
        </div>
      </div>

      {/* Regular Signup Form */}
      <form className="space-y-7" onSubmit={handleSignup}>
        {/* First Name */}
        <div>
          <label className="block text-sm font-saiyan text-blue-700 mb-3 tracking-wide">
            EARTHLING NAME (FIRST NAME)
          </label>
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
            <input
              type="text"
              placeholder="Your First Name"
              className="w-full pl-12 pr-4 py-4 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-saiyan"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-saiyan text-blue-700 mb-3 tracking-wide">
            EARTHLING NAME (LAST NAME)
          </label>
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
            <input
              type="text"
              placeholder="Your Last Name"
              className="w-full pl-12 pr-4 py-4 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-saiyan"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
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

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-saiyan text-blue-700 mb-3 tracking-wide">
          CONFIRM BATTLE PASSWORD
        </label>
        <div className="relative">
          <input
            type="password"
            placeholder="Confirm your battle password"
            className="w-full pl-4 pr-4 py-4 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-saiyan"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {confirmPassword && password !== confirmPassword && (
          <span className="text-xs text-red-500 font-medium mt-1 block">
            Passwords do not match
          </span>
        )}
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
    </div>
  );
}

export default Signup;