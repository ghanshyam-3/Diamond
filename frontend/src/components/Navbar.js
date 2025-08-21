import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 text-white p-3 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/assignments">Assignments</Link>
        
        {user?.role === "manager" && (
          <Link to="/manager/assign">Assign Diamond</Link>
        )}
        
        {user?.role === "owner" && (
          <Link to="/user-management" className="text-blue-300 hover:text-blue-200">
            User Management
          </Link>
        )}
      </div>

      <button 
        onClick={handleLogout}
        className="bg-red-600 px-4 py-1 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </nav>
  );
}
