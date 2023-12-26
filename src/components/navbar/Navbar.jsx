import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import gigitise from '../../../public/gigitise.svg';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { useAuthContext } from '../../providers/AuthProvider';
import './navbar.css';

const Navbar = () => {
    const iconSize = 28;
    const { loadingUserProfile, loadedUserProfile, handleLogOut } = useAuthContext();
    const [userProfile, setUserProfile] = useState(loadedUserProfile);


    const navigate = useNavigate();

    return(
        <div className="nav">
            <div className="heading-container">
                <img src={gigitise} className="logo-img" alt="gigitise-logo" />
                <h2>Gigitise</h2>
            </div>
            <div className="search-nav">
                <input className="search-input" type="text" placeholder="Search categories of orders" />
            </div>
            <div>
                <h2 className="logout">Logout</h2>
            </div>
            <div className="notif-bell">
                <IoMdNotificationsOutline className="notif-icon" size={iconSize} />
            </div>
            <div className="profile-info" onClick={() => navigate('./profile')}>
                <article style={{width: loadingUserProfile?'3rem':''}}>{userProfile?.username}</article>
                {
                userProfile?.profile_photo?
                <img src={userProfile?.profile_photo} alt="profile cover" />:
                <article className='img-placeholder'>{userProfile && `${(userProfile?.username?.charAt(0)?.toUpperCase() + userProfile?.username.slice(1).slice(0,1))}`}</article>
                }
            </div>
        </div>
    );
};

export default Navbar;