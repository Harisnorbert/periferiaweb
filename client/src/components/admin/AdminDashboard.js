import React from "react";
import { Link, Outlet } from "react-router-dom";
import RendelesChart from "./RendelesChart";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h2>Admin kezelőfelület</h2>

      <nav className="admin-nav">
        <Link to="/admin/termekek">Termékek kezelése</Link>
        <Link to="/admin/rendelesek">Rendelések</Link>
      </nav>
      <div className="admin-tartalom">
        <RendelesChart />
      </div>
    </div>
  );
};

export default AdminDashboard;
