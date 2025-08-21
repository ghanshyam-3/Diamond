import { useState } from "react";
import axios from "axios";

export default function AddDiamondForm() {
  const [form, setForm] = useState({
    unique_id: "",
    carat: "",
    color: "D",
    clarity: "VS1",
    shape: "Round",
    status: "in_stock",
    buying_price: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      await axios.post("http://localhost:5000/api/diamonds", form, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      alert("Diamond saved successfully!");
      setForm({
        unique_id: "",
        carat: "",
        color: "D",
        clarity: "VS1",
        shape: "Round",
        status: "in_stock",
        buying_price: "",
      });
    } catch (err) {
      alert("Error: " + err.response?.data?.message || "Failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border rounded p-4">
      <h3 className="text-lg font-semibold mb-2">Add New Diamond</h3>

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
        {["D", "E", "F", "G", "H", "I", "J", "K", "L"].map((c) => (
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
        {["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"].map((c) => (
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
        {["Round", "Princess", "Emerald", "Pear", "Oval", "Heart", "Cushion"].map((c) => (
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
        {["in_stock", "approved_for_polish", "assigned", "polished", "sold"].map((c) => (
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
        Save Diamond
      </button>
    </form>
  );
}
