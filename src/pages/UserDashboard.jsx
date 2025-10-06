import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaFileAlt, FaUser, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import PostList from "../components/PostList";
import NotificationBell from "../components/NotificationBell";

function UserDashboard() {
  const [activePage, setActivePage] = useState("posts");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token || role !== 'user') {
      navigate('/login', { replace: true });
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <div className="p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {username} 👋</h1>
              <p className="text-gray-600 mb-6">Welcome to Supreme Court Opinion Portal</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaFileAlt className="text-blue-600 text-lg" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900">Court Documents</p>
                      <p className="text-sm text-blue-700">Access legal opinions</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FaUser className="text-green-600 text-lg" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">Your Profile</p>
                      <p className="text-sm text-green-700">Manage account</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-purple-900">Notifications</p>
                      <p className="text-sm text-purple-700">Stay updated</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "posts":
        return (
          <div className="p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Court Documents</h1>
              <p className="text-gray-600">Browse and access judicial opinions and legal documents</p>
            </div>
            <PostList />
          </div>
        );
      case "profile":
        return (
          <div className="p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h1>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xl font-bold">
                      {username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{username}</h2>
                    <p className="text-gray-600">Legal Professional</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <p className="text-gray-900 font-medium">{username}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Legal Access
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Access Level</label>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Document Viewer
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Active
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Last Login</span>
                      <span className="text-gray-900">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Session Active</span>
                      <span className="text-green-600 font-medium">Yes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isSidebarOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Supreme Court</h1>
              <p className="text-xs text-gray-500">Opinion Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <NotificationBell />
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <FaSignOutAlt className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar - Desktop & Mobile */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-40
        w-64 bg-gradient-to-b from-blue-900 to-blue-900 shadow-lg lg:shadow-none border-r border-blue-700
        transform transition-transform duration-300 ease-in-out
        flex flex-col h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:translate-x-0
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-blue-700">
          <h2 className="text-xl font-bold text-white">Legal Portal</h2>
          <p className="text-sm text-blue-200 mt-1">Hello, {username}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => handleNavigation("dashboard")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${
              activePage === "dashboard" 
                ? "bg-blue-600 text-white shadow-md" 
                : "text-blue-100 hover:bg-blue-700 hover:text-white"
            }`}
          >
            <FaHome className="text-lg" /> 
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => handleNavigation("posts")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${
              activePage === "posts" 
                ? "bg-blue-600 text-white shadow-md" 
                : "text-blue-100 hover:bg-blue-700 hover:text-white"
            }`}
          >
            <FaFileAlt className="text-lg" /> 
            <span>Court Documents</span>
          </button>

          <button
            onClick={() => handleNavigation("profile")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${
              activePage === "profile" 
                ? "bg-blue-600 text-white shadow-md" 
                : "text-blue-100 hover:bg-blue-700 hover:text-white"
            }`}
          >
            <FaUser className="text-lg" /> 
            <span>Profile</span>
          </button>
        </nav>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Desktop Header */}
        <div className="hidden lg:block bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex justify-between items-center p-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activePage === "dashboard" && "Legal Dashboard"}
                {activePage === "posts" && "Court Documents"}
                {activePage === "profile" && "User Profile"}
              </h1>
              <p className="text-gray-600 mt-1">
                {activePage === "dashboard" && "Welcome to Supreme Court Opinion Portal"}
                {activePage === "posts" && "Browse and access judicial documents"}
                {activePage === "profile" && "Manage your account and preferences"}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <NotificationBell />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{username}</p>
                  <p className="text-sm text-gray-500">Legal Access</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium border border-gray-200"
                title="Logout"
              >
                <FaSignOutAlt className="text-lg" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Page Content - Scrollable area */}
        <div className="flex-1 overflow-y-auto mt-16 lg:mt-0">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;