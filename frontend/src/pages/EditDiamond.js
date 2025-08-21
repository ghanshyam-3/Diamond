import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function EditDiamond() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  const [form, setForm] = useState({
    unique_id: "",
    carat: "",
    color: "D",
    clarity: "VS1",
    shape: "Round",
    status: "in_stock",
    buying_price: ""
  });

  const fetchData = async () => {
    const res = await axios.get(`http://localhost:5000/api/diamonds`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const single = res.data.find((d) => d._id === id);
    setForm({
      ...form,
      unique_id: single.unique_id || "",
      carat: single.carat || "",
      color: single.color || "D",
      clarity: single.clarity || "VS1",
      shape: single.shape || "Round",
      status: single.status || "in_stock",
      buying_price: single.buying_price || ""
    });
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:5000/api/diamonds/${id}`, form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("Updated!");
    navigate("/dashboard");
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl mb-3 font-bold">Edit Diamond</h2>

        <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded">
          <input
            name="unique_id"
            placeholder="Unique ID"
            value={form.unique_id}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <input
            name="carat"
            placeholder="Carat"
            value={form.carat}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          {/* Color dropdown */}
          <select
            name="color"
            value={form.color}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            {["D","E","F","G","H","I","J","K","L"].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Clarity dropdown */}
          <select
            name="clarity"
            value={form.clarity}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            {["FL","IF","VVS1","VVS2","VS1","VS2","SI1","SI2"].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Shape dropdown */}
          <select
            name="shape"
            value={form.shape}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            {["Round","Princess","Emerald","Pear","Oval","Heart","Cushion"].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Status dropdown */}
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            {["in_stock","approved_for_polish","assigned","polished","sold"].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input
            name="buying_price"
            placeholder="Buying Price"
            value={form.buying_price}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Update Diamond
          </button>
        </form>
      </div>
    </div>
  );
}
