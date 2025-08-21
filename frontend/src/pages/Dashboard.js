import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import EmployeeDashboard from "../components/EmployeeDashboard";
import OwnerDiamondTable from "../components/OwnerDiamondTable";


export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/");
    } else {
      setUser(userInfo);
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div>
      <Navbar />

      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <p>Role: <strong>{user.role}</strong></p>

        {/* Owner Dashboard */}
        {user.role === 'owner' && (
          <div className="space-y-4">
            <div className="border p-4 rounded bg-gray-100">
              <h2 className="text-xl font-semibold mb-2">Owner Dashboard</h2>
              <p>Here you can add diamonds, view analytics and manage everything.</p>
              <Link 
                to="/add-diamond"
                className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add New Diamond
              </Link>
            </div>
            <OwnerDiamondTable />

          </div>
        )}

        {/* Manager Dashboard */}
        {user.role === 'manager' && (
          <div className="border p-4 rounded bg-gray-100">
            <h2 className="text-xl font-semibold">Manager Dashboard</h2>
            <p>View diamonds approved by owner and assign to employees.</p>
          </div>
        )}

        {/* Employee Dashboard */}
        {user.role === 'employee' && (
  <EmployeeDashboard />
)}

      </div>
    </div>
  );
}
