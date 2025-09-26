import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Auth.css";
import AuthTabs from "./AuthTabs";
import CapsuleLogo from "../../components/CapsuleLogo";
import AuthFooter from "../../components/AuthFooter";


function AuthPage() {
  const [searchParams] = useSearchParams();
  const [initialTab, setInitialTab] = useState("login");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "signup") {
      setInitialTab("signup");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen nebula-bg flex flex-col">
      <header className="py-8">
        <CapsuleLogo />
        <p className="text-blue-200 font-medium text-center">
          Secure Access to Planet Earth's Finest Tech
        </p>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <AuthTabs initialTab={initialTab} />
      </main>
      <AuthFooter />
    </div>
  );
}

export default AuthPage;
