import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUsers, FaFileAlt, FaUser, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import CreateUserForm from "../components/CreateUserForm";
import EditUserForm from "../components/EditUserForm";
import CreatePostForm from "../components/CreatePostForm";
import PostList from "../components/PostList";
import NotificationBell from "../components/NotificationBell";
import API from "../api/axios";

function AdminDashboard() {
  const [activePage, setActivePage] = useState("home");
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshPosts, setRefreshPosts] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Admin";

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token || role !== 'admin') {
      navigate('/login', { replace: true });
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/login", { replace: true });
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    setIsSidebarOpen(false);
  };

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users", err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case "home":
        return (
          <div className="p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {username} 👋</h1>
              <p className="text-gray-600 mb-6">Supreme Court Opinion - Administrative Portal</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaUsers className="text-blue-600 text-lg" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900">Total Users</p>
                      <p className="text-2xl font-bold text-blue-600">{users.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FaFileAlt className="text-green-600 text-lg" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">Documents</p>
                      <p className="text-2xl font-bold text-green-600">-</p>
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
                      <p className="text-2xl font-bold text-purple-600">-</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FaUser className="text-orange-600 text-lg" />
                    </div>
                    <div>
                      <p className="font-semibold text-orange-900">Admins</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {users.filter(user => user.role === 'admin').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleNavigation("users")}
                      className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FaUsers className="text-blue-600" />
                        <span className="font-medium">Manage Users</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleNavigation("posts")}
                      className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-green-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FaFileAlt className="text-green-600" />
                        <span className="font-medium">Manage Documents</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2">
                      <span className="text-gray-700">Database</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
                    </div>
                    <div className="flex justify-between items-center p-2">
                      <span className="text-gray-700">File Storage</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                    </div>
                    <div className="flex justify-between items-center p-2">
                      <span className="text-gray-700">Notifications</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Live</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "users":
        return (
          <div className="p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">User Management</h1>
                  <p className="text-gray-600">Manage system users and access permissions</p>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                >
                  <FaUser className="text-lg" />
                  Create User
                </button>
              </div>
            </div>

            {showForm && (
              <div className="mb-6">
                <CreateUserForm
                  onClose={() => {
                    setShowForm(false);
                    fetchUsers();
                  }}
                />
              </div>
            )}

            {editUser && (
              <div className="mb-6">
                <EditUserForm
                  user={editUser}
                  onClose={() => setEditUser(null)}
                  onUpdate={fetchUsers}
                />
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-sm font-medium">
                                {user.username?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditUser(user)}
                              className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded text-sm transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={async () => {
                                if (!window.confirm(`Are you sure you want to delete user "${user.username}"?`)) return;
                                try {
                                  await API.delete(`/users/${user._id}`, {
                                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                                  });
                                  fetchUsers();
                                } catch (err) {
                                  console.error("Error deleting user:", err);
                                  alert("Error deleting user");
                                }
                              }}
                              className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded text-sm transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "posts":
        return (
          <div className="p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Document Management</h1>
              <p className="text-gray-600">Create and manage court documents and opinions</p>
            </div>
            
            <div className="mb-6">
              <CreatePostForm onPostCreated={() => setRefreshPosts(!refreshPosts)} />
            </div>
            
            <div>
              <PostList key={refreshPosts} />
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
              <p className="text-xs text-gray-500">Admin Portal</p>
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
          <h2 className="text-xl font-bold text-white">Admin Portal</h2>
          <p className="text-sm text-blue-200 mt-1">Hello, {username}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => handleNavigation("home")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${
              activePage === "home" 
                ? "bg-blue-600 text-white shadow-md" 
                : "text-blue-100 hover:bg-blue-700 hover:text-white"
            }`}
          >
            <FaHome className="text-lg" /> 
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              handleNavigation("users");
              fetchUsers();
            }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${
              activePage === "users" 
                ? "bg-blue-600 text-white shadow-md" 
                : "text-blue-100 hover:bg-blue-700 hover:text-white"
            }`}
          >
            <FaUsers className="text-lg" /> 
            <span>Manage Users</span>
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
            <span>Documents</span>
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
                {activePage === "home" && "Admin Dashboard"}
                {activePage === "users" && "User Management"}
                {activePage === "posts" && "Document Management"}
              </h1>
              <p className="text-gray-600 mt-1">
                {activePage === "home" && "Supreme Court Opinion - Administrative Portal"}
                {activePage === "users" && "Manage system users and access permissions"}
                {activePage === "posts" && "Create and manage court documents"}
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
                  <p className="text-sm text-gray-500">Administrator</p>
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

export default AdminDashboard;