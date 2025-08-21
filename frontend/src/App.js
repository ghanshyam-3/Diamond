import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManagerAssign from "./pages/ManagerAssign";
import AssignmentsPage from "./pages/AssignmentsPage";
import EditDiamond from "./pages/EditDiamond";
import AddDiamond from "./pages/AddDiamond";
import SignUp from "./pages/SignUp";
import UserManagement from "./pages/UserManagement";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manager/assign" element={<ManagerAssign />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/diamond/edit/:id" element={<EditDiamond />} />
          <Route path="/add-diamond" element={<AddDiamond />} />
          <Route path="/user-management" element={<UserManagement />} />
        </Routes>

        {/* ✅ Toast container OUTSIDE of Routes */}
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    </BrowserRouter>
  );
}

export default App;
