import React from "react";
import "../admin/AdminHeader.css";
import { Link } from "react-router-dom";

function AdminHeader() {
  return (
    <div>
      <div className="header header_admin">
        <nav className="container">
          <div className="container-fluid">
            <Link to={"/"}>
              <i class="fa-solid fa-house-user home_admin"></i>
            </Link>

            <div className="title_admin">
              <h3>ADMIN</h3>
            </div>
            <div className="header_navbar_item">
                <ul>
                    <li><i class="fa-regular fa-envelope"></i></li>
                    <li><i class="fa-regular fa-bell"></i></li>
                    <li><i class="fa-solid fa-gear"></i></li>
                </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default AdminHeader;
