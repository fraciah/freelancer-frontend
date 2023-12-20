import gigitise from '../../../public/gigitise.svg';
import { IoMdNotificationsOutline } from 'react-icons/io';
import './navbar.css';

const Navbar = () => {
  const iconSize = 25;

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
        <div className="profile">
            <article>Username</article>
            {/* user-profile */}
        </div>
    </div>
  );
};

export default Navbar;