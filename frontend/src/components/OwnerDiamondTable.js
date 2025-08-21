import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function OwnerDiamondTable() {
  const [diamonds, setDiamonds] = useState([]);
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = user?.token;

  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000/api/diamonds", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setDiamonds(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;
    await axios.delete(`http://localhost:5000/api/diamonds/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchData();
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">All Diamonds</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Carat</th>
            <th className="p-2 border">Color</th>
            <th className="p-2 border">Clarity</th>
            <th className="p-2 border">Shape</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {diamonds.map((d) => (
            <tr key={d._id}>
              <td className="p-2 border">{d.unique_id}</td>
              <td className="p-2 border">{d.carat}</td>
              <td className="p-2 border">{d.color}</td>
              <td className="p-2 border">{d.clarity}</td>
              <td className="p-2 border">{d.shape}</td>
              <td className="p-2 border">{d.status}</td>
              <td className="p-2 border flex gap-2">
                <Link
                  to={`/diamond/edit/${d._id}`}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(d._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
