import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate API call and check credentials
    setTimeout(() => {
      setIsLoading(false);
      const isValidAdmin = email === 'admin@gmail.com' && password === '12345678';
      if (isValidAdmin) {
        localStorage.setItem('userRole', 'Admin');
        navigate('/');
      } else {
        setError('Invalid email or password. Please check your credentials.');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-100 relative overflow-hidden font-sans">
      <div className="w-full max-w-md bg-white p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10 mx-4 border border-white">
        
        {/* Logo Section */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-12 h-12 bg-[#7148DF] rounded-[14px] flex items-center justify-center text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                <path d="M8.5 6v9.5c0 1.5 1 2.5 2.5 3" />
                <path d="M14.5 6v9.5c0 1.5 1 2.5 2.5 3" />
              </svg>
            </div>
            <span className="text-[32px] font-bold tracking-tight text-[#1E293B] flex items-start leading-none mt-1">
              Learnlike<sup className="text-[12px] font-semibold mt-1 ml-0.5 text-[#475569]">&reg;</sup>
            </span>
          </div>
          <p className="text-[14px] text-slate-500 font-medium tracking-wide mt-1">Account Management System</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm mb-5 text-center font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[13px] font-bold text-slate-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm transition-all"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm transition-all pr-12"
                placeholder="Enter your password"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-violet-500 hover:bg-violet-600 text-white font-medium flex justify-center items-center py-3.5 mt-4 rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <LogIn size={18} className="mr-2" />
                Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}