import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import gigitise from '../../../public/gigitise.svg';
import { IoMdNotificationsOutline } from 'react-icons/io';
import './navbar.css';

const Navbar = () => {
  const iconSize = 28;
  const [username, setUsername] = useState('Username');
  const [profilePhoto, setProfilePhoto] = useState(null);

  const navigate = useNavigate();

  return (
    <div className="nav">
        <div style={{ cursor: 'pointer' }} className="heading-container">
            <img src={gigitise} className="logo-img" alt="gigitise-img" />
            <h2>Gigitise</h2>
        </div>
        <div className="search-nav">
            <input className="search-input" type="text" placeholder="Search categories of orders" />
        </div>
        <div className="notif-bell">
            <IoMdNotificationsOutline className="notif-icon" size={iconSize} />
        </div>
        <div className="profile" onClick={() => navigate('./profile')}>
            <article>{username}</article>
            {profilePhoto ? (
                <img src={profilePhoto} alt="ProfileImg" />
            ) : (
                <article className="img-placeholder">{username.slice(0, 1).toUpperCase()}{username.slice(1, 2).toLowerCase()}</article>
            )}
        </div>
    </div>
  );
};

export default Navbar;