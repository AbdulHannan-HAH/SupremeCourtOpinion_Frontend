import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom"; 
import API from "../api/axios"; 
import { toast } from "react-toastify"; 

function Login() { 
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate(); 

  useEffect(() => { 
    const token = localStorage.getItem("token"); 
    const role = localStorage.getItem("role"); 
    if (token && role) { 
      if (role === "admin") navigate("/admin", { replace: true }); 
      else if (role === "user") navigate("/user", { replace: true }); 
    } 
  }, [navigate]); 

  const handleLogin = async (e) => { 
    e.preventDefault(); 
    if (!username.trim() || !password.trim()) { 
      setError("Please enter both username and password"); 
      return; 
    } 
    setIsLoading(true); 
    setError(""); 
    try { 
      const { data } = await API.post("/auth/login", { 
        username: username.trim(), 
        password: password.trim(), 
      }); 
      localStorage.setItem("token", data.token); 
      localStorage.setItem("role", data.role); 
      localStorage.setItem("username", data.username); 
      toast.success(`Welcome back, ${data.username}!`, { 
        position: "top-right", 
        autoClose: 3000, 
      }); 
      setTimeout(() => { 
        if (data.role === "admin") navigate("/admin", { replace: true }); 
        else if (data.role === "user") navigate("/user", { replace: true }); 
        else { 
          setError("Invalid role. Contact administrator."); 
          localStorage.removeItem("token"); 
          localStorage.removeItem("role"); 
          localStorage.removeItem("username"); 
        } 
      }, 1000); 
    } catch (err) { 
      console.error("Login error:", err); 
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          "Login failed. Please check your credentials and try again."; 
      setError(errorMessage); 
      toast.error(errorMessage, { 
        position: "top-right", 
        autoClose: 5000, 
      }); 
      setPassword(""); 
    } finally { 
      setIsLoading(false); 
    } 
  }; 

  return ( 
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4"> 
      <div className="max-w-md w-full"> 
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100"> 
          {/* Header Section */} 
          <div 
            className="py-12 px-8 text-center relative overflow-hidden min-h-[200px] flex items-center justify-center"
            style={{ 
              backgroundImage: "url('/images/supreme-court-bg.png')", 
              backgroundSize: "cover", 
              backgroundPosition: "center", 
              backgroundRepeat: "no-repeat", 
            }} 
          > 
            <div className="absolute inset-0 bg-black/40"></div> 
            
            {/* Circle with Centered Image */}
            <div className="relative z-10 text-white"> 
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30 backdrop-blur-sm overflow-hidden">
                <img 
                  src="/images/logo.png" 
                  alt="Court Logo" 
                  className="w-16 h-16 object-contain"  
                /> 
              </div> 
              <h1 className="text-2xl font-bold mb-2 font-serif"> 
                Supreme Court Opinion 
              </h1> 
              <p className="text-white/90 text-sm"> 
                Judicial Document Management System 
              </p> 
            </div> 
          </div> 

          {/* Form Section */} 
          <div className="p-8"> 
            <div className="text-center mb-6"> 
              <h2 className="text-xl font-semibold text-gray-800"> 
                Secure Login 
              </h2> 
              <p className="text-gray-600 text-sm mt-1"> 
                Access authorized court documents and opinions 
              </p> 
            </div> 
            <form onSubmit={handleLogin} className="space-y-5"> 
              {error && ( 
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3"> 
                  <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" > 
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /> 
                  </svg> 
                  <span className="text-red-800 text-sm font-medium"> 
                    {error} 
                  </span> 
                </div> 
              )} 
              <div className="space-y-2"> 
                <label htmlFor="username" className="block text-sm font-medium text-gray-700" > 
                  Username 
                </label> 
                <input 
                  id="username" 
                  type="text" 
                  required 
                  placeholder="Enter your username" 
                  className="block w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200" 
                  value={username} 
                  onChange={(e) => { 
                    setUsername(e.target.value); 
                    setError(""); 
                  }} 
                  disabled={isLoading} 
                /> 
              </div> 
              <div className="space-y-2"> 
                <label htmlFor="password" className="block text-sm font-medium text-gray-700" > 
                  Password 
                </label> 
                <input 
                  id="password" 
                  type="password" 
                  required 
                  placeholder="Enter your password" 
                  className="block w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200" 
                  value={password} 
                  onChange={(e) => { 
                    setPassword(e.target.value); 
                    setError(""); 
                  }} 
                  disabled={isLoading} 
                /> 
              </div> 
              <button 
                type="submit" 
                disabled={isLoading || !username.trim() || !password.trim()} 
                className="w-full bg-blue-600 text-white py-3.5 px-4 rounded-lg font-semibold transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" 
              > 
                {isLoading ? ( 
                  <div className="flex items-center justify-center space-x-2"> 
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> 
                    <span>Authenticating...</span> 
                  </div> 
                ) : ( 
                  "Access System" 
                )} 
              </button> 
            </form> 
          </div> 
        </div> 
      </div> 
    </div> 
  ); 
} 

export default Login;