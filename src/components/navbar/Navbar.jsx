import React from "react";
import "./navbar.css";
import { IoMdNotificationsOutline, IoMdSettings } from "react-icons/io";
import { MdHelpOutline } from "react-icons/md";
import { useAuthContext } from "../../providers/AuthProvider";
import { useState } from "react";
import { useOrderContext } from "../../providers/OrderProvider";
import { useNotificationContext } from "../../providers/NotificationProvider";
import { useNavigate } from "react-router-dom";
import { MdOutlineMenu } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { IoIosLogOut } from "react-icons/io";
import { useEffect, useRef } from "react";

const Navbar = () => {
  const navigate = useNavigate();

  const [showMoreElements, setShowMoreElements] = useState(false);
  const [searchVisible, setSearchVisible] = useState(true);
  

  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setShowMoreElements(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { loadingUserProfile, loadedUserProfile, handleLogOut } =
    useAuthContext();

  const [userProfile, setUserProfile] = useState(loadedUserProfile);

  const { unreadNotifCount } = useNotificationContext();

  const { orders } = useOrderContext();

  const iconSize = 25;

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const searchOrdersFromQuery = (input) => {
    setSearchQuery(input);

    const filteredSuggestions = orders.filter((order) => {
      return order.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    setSuggestions(filteredSuggestions.slice(0, 5));

    // console.log(suggestions)
  };

  const goToOrder = (id) => {
    setSearchQuery("");
    setSuggestions([]);
    navigate(`./order/${id}`);
  };

  return (
    <div className={`top-nav ${searchVisible ? "search-visible" : ""}`}>
      <div className="icons">
        <div className="search-icon" onClick={() => setSearchVisible(!searchVisible)}>
        {searchVisible && (
            <MdKeyboardArrowLeft
            size={iconSize}
              
            />
          )}
          <IoSearchOutline 
          size={iconSize}
          />
        </div>
      </div>
      <div className={`search-nav ${searchVisible ? "visible" : "mobile-invisible"}`}>
        <input
          value={searchQuery}
          onChange={(e) => searchOrdersFromQuery(e.target.value)}
          type="text"
          placeholder="Search my orders"
        />
        {suggestions.length > 0 && searchQuery && (
          <div className="suggestions">
            {suggestions?.map((suggestedOrder, index) => {
              return (
                <div
                  className="suggested"
                  key={index}
                  onClick={() => goToOrder(suggestedOrder.id)}
                >
                  <article>{suggestedOrder.title}</article>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className={`profile ${searchVisible ? "visible" : ""}`}>
        <div
          className={`mini-elements ${
            showMoreElements ? "show-mini-elements" : "hide-mini-elements"
          }`}
          ref={navRef}
        >
          <div onClick={() => handleLogOut()}>
            <article className="logout">Logout</article>
            <span>
              <IoIosLogOut className="desc" size={iconSize} />
            </span>
          </div>
          <div className="help">
            <span className="desc">Support</span>
            <span>
              <MdHelpOutline className="" size={iconSize} />
            </span>
          </div>
          <div
            className="notif-bell"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("./notifications")}
          >
            <span className="desc">Notifications</span>
            <span>
              <IoMdNotificationsOutline
                className="notif-icon"
                size={iconSize}
              />
            </span>
            {unreadNotifCount > 0 && (
              <div className="red">
                <div>
                  <article>
                    {unreadNotifCount > 9 ? "9+" : unreadNotifCount}
                  </article>
                </div>
              </div>
            )}
          </div>
          <div className="settings" onClick={() => navigate("./settings")}>
            <span className="desc">Settings</span>
            <span>
              <IoMdSettings style={{ cursor: "pointer" }} size={iconSize} />
            </span>
          </div>
        </div>
        <div className="profile-info" onClick={() => navigate("./profile")}>
          <article
            className={loadingUserProfile ? "username-skeleton" : ""}
            style={{ width: loadingUserProfile ? "3rem" : "" }}
          >
            {userProfile?.username}
          </article>
          {userProfile?.profile_photo ? (
            <img
              style={{
                animation: loadingUserProfile
                  ? `skeleton-loading 1s linear infinite alternate`
                  : "",
              }}
              src={userProfile?.profile_photo}
              alt="profile cover"
            />
          ) : (
            <article
              style={{
                animation: loadingUserProfile
                  ? `skeleton-loading 1s linear infinite alternate`
                  : "",
              }}
              className="img-placeholder"
            >
              {userProfile &&
                `${
                  userProfile?.username?.charAt(0)?.toUpperCase() +
                  userProfile?.username.slice(1).slice(0, 1)
                }`}
            </article>
          )}
        </div>
        <div className="menu-icon">
          {showMoreElements ? (
            <AiOutlineClose
              onClick={() => setShowMoreElements(false)}
              style={{ cursor: "pointer" }}
              size={iconSize}
            />
          ) : (
            <MdOutlineMenu
              onClick={() => setShowMoreElements(true)}
              style={{ cursor: "pointer" }}
              size={iconSize}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;