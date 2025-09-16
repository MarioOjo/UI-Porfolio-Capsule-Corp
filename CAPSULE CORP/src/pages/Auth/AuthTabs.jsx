// ...existing code...
function AuthTabs() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="w-full max-w-lg bg-white/95 backdrop-blur-sm rounded-2xl capsule-shadow overflow-hidden border border-blue-600/20">
      <div className="flex relative" role="tablist" aria-label="Authentication tabs">
        <button
          role="tab"
          aria-pressed={activeTab === "login"}
          className={`flex-1 py-5 px-6 text-center font-bold font-saiyan text-lg transition-all duration-300 ${
            activeTab === "login"
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white ki-glow"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("login")}
        >
          LOGIN
        </button>
        <button
          role="tab"
          aria-pressed={activeTab === "signup"}
          className={`flex-1 py-5 px-6 text-center font-bold font-saiyan text-lg transition-all duration-300 ${
            activeTab === "signup"
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white ki-glow"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("signup")}
        >
          SIGN UP
        </button>
      </div>
      <div className="p-8">
        {activeTab === "login" ? (
          <Login onSwitchTab={() => setActiveTab("signup")} />
        ) : (
          <Signup onSwitchTab={() => setActiveTab("login")} />
        )}
      </div>
    </div>
  );
}
// ...existing code...