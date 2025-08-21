import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function ManagerAssign() {
  const [diamonds, setDiamonds] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ diamond: "", employee: "", price_per_polish: "" });

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  async function fetchData() {
    try {
      const dres = await axios.get("http://localhost:5000/api/diamonds", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiamonds(dres.data.filter((d) => d.status === "approved_for_polish"));

      const ures = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(ures.data.filter((u) => u.role === "employee"));
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/assign", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Assigned!");
      setForm({ diamond: "", employee: "", price_per_polish: "" });
      fetchData();
    } catch (err) {
      alert("Error assigning");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Assign Diamond to Employee</h2>

        <form onSubmit={handleAssign} className="space-y-3 border p-4 rounded">
          <select
            name="diamond"
            value={form.diamond}
            onChange={(e) => setForm({ ...form, diamond: e.target.value })}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select Diamond --</option>
            {diamonds.map((d) => (
              <option key={d._id} value={d._id}>
                {d.unique_id} ({d.carat}ct)
              </option>
            ))}
          </select>

          <select
            name="employee"
            value={form.employee}
            onChange={(e) => setForm({ ...form, employee: e.target.value })}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select Employee --</option>
            {employees.map((u) => (
              <option key={u._id} value={u._id}>{u.name}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Price per polish"
            value={form.price_per_polish}
            onChange={(e) => setForm({ ...form, price_per_polish: e.target.value })}
            required
            className="w-full border p-2 rounded"
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">Assign</button>
        </form>
      </div>
    </div>
  );
}
