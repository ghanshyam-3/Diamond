import { useEffect, useState } from "react";
import axios from "axios";

export default function EmployeeDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [earning, setEarning] = useState(null);
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = user?.token;

  const fetchData = async () => {
    try {
      // get all assignments for this employee
      let res1 = await axios.get("http://localhost:5000/api/assign/employee", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(res1.data);

      // get current month earning
      let res2 = await axios.get("http://localhost:5000/api/earnings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEarning(res2.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const markDone = async (id) => {
    await axios.put(
      `http://localhost:5000/api/assign/complete/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow mb-6">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="mt-1 text-sm text-gray-500">Role: {user?.role}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Earnings Card */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900">Current Month Earning</h3>
            {earning ? (
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">₹{earning.total}</p>
                <p className="ml-2 text-sm text-gray-500">
                  {earning.month} • {earning.count} diamonds done
                </p>
              </div>
            ) : (
              <p className="text-gray-500 mt-2">Loading...</p>
            )}
          </div>
        </div>

        {/* Assignments Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Assignments</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diamond ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignments.map((a) => (
                <tr key={a._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {a.diamond?.unique_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{a.price_per_polish}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${a.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {a.status === "assigned" ? (
                      <button
                        onClick={() => markDone(a._id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Mark Done
                      </button>
                    ) : (
                      <span className="text-green-600 font-medium">Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
