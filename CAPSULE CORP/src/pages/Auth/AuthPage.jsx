import "./Auth.css";
import AuthTabs from "./AuthTabs";
import CapsuleLogo from "../../components/CapsuleLogo";
import AuthFooter from "../../components/AuthFooter";

function AuthPage() {
  return (
    <div className="min-h-screen nebula-bg flex flex-col">
      <header className="py-8">
        <CapsuleLogo />
        <p className="text-blue-200 font-medium text-center">
          Secure Access to Planet Earth's Finest Tech
        </p>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <AuthTabs />
      </main>
      <AuthFooter />
    </div>
  );
}

export default AuthPage;
