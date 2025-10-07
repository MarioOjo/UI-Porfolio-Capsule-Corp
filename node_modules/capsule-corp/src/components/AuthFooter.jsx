function AuthFooter({ className = "" }) {
  return (
    <footer className={`py-10 text-center bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 border-t border-blue-800/50 ${className}`}>
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-200 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-blue-600 text-lg font-bold">CC</span>
        </div>
        <h5 className="font-saiyan font-bold text-white text-lg tracking-wider">CAPSULE CORP.</h5>
      </div>
      <p className="text-blue-200 text-sm mb-6 font-medium">Protecting Earth's technology since Age 712</p>
      <div className="flex justify-center space-x-8 mb-6">
        <span className="text-sm text-blue-300 hover:text-white cursor-pointer transition-colors font-medium">Privacy Policy</span>
        <span className="text-sm text-blue-300 hover:text-white cursor-pointer transition-colors font-medium">Terms of Service</span>
        <span className="text-sm text-blue-300 hover:text-white cursor-pointer transition-colors font-medium">Support</span>
      </div>
      <p className="text-blue-400 text-xs font-saiyan tracking-wide">© Age 762 Capsule Corporation. Secured by Saiyan technology.</p>
    </footer>
  );
}
export default AuthFooter;
// filepath: c:\Users\User\OneDrive\Desktop\UI-Porfolio-Capsule-Corp\CAPSULE CORP\src\components\AuthFooter.jsx