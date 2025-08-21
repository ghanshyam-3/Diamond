import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function AssignmentsPage() {
  const [data, setData] = useState([]);
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = user?.token;

  const fetchData = async () => {
    try {
      let url = "";

      if (user.role === "employee") {
        url = "http://localhost:5000/api/assign/employee";
      } else {
        // owner or manager
        url = "http://localhost:5000/api/assign/manager";
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const markCompleted = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/assign/complete/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Marked completed!");
      fetchData();
    } catch (err) {
      alert("Error");
    }
  };

  const verifyAndMarkPolished = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/assign/verify/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update the data immediately with the response
      setData(prevData => 
        prevData.map(item => 
          item._id === id ? response.data : item
        )
      );
      alert("Verified and marked as polished!");
    } catch (err) {
      alert(err.response?.data?.message || "Error verifying assignment");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Assignments List</h1>

        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Diamond ID</th>
              <th className="p-2 border">Employee Name</th>
              <th className="p-2 border">Price Per Polish</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((a) => (
              <tr key={a._id}>
                <td className="p-2 border">{a.diamond?.unique_id}</td>
                <td className="p-2 border">{a.employee?.name}</td>
                <td className="p-2 border">{a.price_per_polish}</td>
                <td className="p-2 border">
                  {a.diamond?.status === 'polished' ? 'polished' : a.status}
                </td>
                <td className="p-2 border">{new Date(a.createdAt).toLocaleDateString()}</td>
                
                <td className="p-2 border">
                  {user.role === "employee" ? (
                    a.status === "assigned" ? (
                      <button
                        onClick={() => markCompleted(a._id)}
                        className="bg-green-600 text-white px-2 py-1 rounded"
                      >
                        Mark Done
                      </button>
                    ) : (
                      "Done"
                    )
                  ) : user.role === "manager" && a.status === "completed" ? (
                    <button
                      onClick={() => verifyAndMarkPolished(a._id)}
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Verify & Mark Polished
                    </button>
                  ) : (
                    a.status
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
