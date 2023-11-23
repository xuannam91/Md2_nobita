import React from "react";
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsBoxArrowLeft,
} from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

function Sildebar() {
  // gọi từ local người dùng về.
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
    const navigate = useNavigate();
    // logout
    const handleLogOut = () => {
      localStorage.removeItem("userLogin");
    };
  

  return (
    <aside id="sidebar" className={"sidebar-responsive"}>
      <div className="sidebar-title">
        <div className="sidebar-brand">
           NOBITA
        </div>
        <span className="icon close_icon">X</span>
      </div>

      <ul className="sidebar-list">

        <li className="sidebar-list-item">
          <Link to={"/admin"}>
            <BsFillArchiveFill className="icon" /> Manager Product
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to={"/manager-user"}>
            <BsPeopleFill className="icon" /> Manager User
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Link to={"/login"} onClick={handleLogOut}>
            <BsBoxArrowLeft className="icon"/> Logout
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sildebar;
