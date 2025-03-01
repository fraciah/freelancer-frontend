import React from "react";
import "./sidenav.css";
// import gigitise from '../../../../public/gigitise.svg';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  MdAdd,
  MdTaskAlt,
  MdPendingActions,
  MdAccessTime,
} from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import { FaClockRotateLeft } from "react-icons/fa6";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";

const SideNav = () => {
  const navigate = useNavigate();
  const [showSideBar, setShowSideBar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const iconSize = 22;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener to window resize
    window.addEventListener("resize", handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // if (
  //   currentUrl.split("/").includes("order") &&
  //   windowWidth > 900 &&
  //   windowWidth < 1200
  // ) {
  //   setShowSideBar(false);
  // }

  return (
    <>
      {showSideBar || windowWidth > 900 ? (
        <div
          className={`side-nav ${
            showSideBar ? "show-side-bar" : "hide-side-bar"
          }`}
        >
          {windowWidth <= 900 && (
            <div className="hide-icon">
              <RiArrowLeftSLine
                color="#fff"
                onClick={() => setShowSideBar(false)}
                size={iconSize}
              />
            </div>
          )}
          <h1
            style={{ cursor: "pointer" }}
            className="heading-logo"
            onClick={() => navigate("./")}
          >
            Gigitise
          </h1>
          <div className="actions">
            <NavLink to="/app" className="nav-item" activeClassName="active-link">
              <FiMenu size={iconSize} />
              Dashboard
            </NavLink>
            <NavLink
              to="./available"
              className="nav-item"
              activeClassName="active-link"
            >
              <FaClockRotateLeft size={iconSize} />
              Available
            </NavLink>
            <NavLink
              to="./my-bids"
              className="nav-item"
              activeClassName="active-link"
            >
              <MdAccessTime size={iconSize} />
          My Bids
            </NavLink>
            <NavLink
              to="./in-progress"
              className="nav-item"
              activeClassName="active-link"
            >
              <MdPendingActions size={iconSize} />
          In Progress
            </NavLink>
            <NavLink
               to="./completed"
              className="nav-item"
              activeClassName="active-link"
            >
              <MdTaskAlt size={iconSize} />
              Completed
            </NavLink>
          </div>
        </div>
      ) : (
        <div className="show-icon">
          <RiArrowRightSLine
            color="#fff"
            onClick={() => setShowSideBar(true)}
            size={iconSize}
          />
        </div>
      )}
    </>
  );
};

export default SideNav;