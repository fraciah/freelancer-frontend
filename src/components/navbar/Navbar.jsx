import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import gigitise from '../../../public/gigitise.svg';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { useAuthContext } from '../../providers/AuthProvider';
import { useOrderContext } from '../../providers/OrderProvider';
import { useNotificationContext } from '../../providers/NotificationProvider';
import './navbar.css';

const Navbar = () => {
    const iconSize = 28;
    const { loadingUserProfile, loadedUserProfile, handleLogOut } = useAuthContext();
    const [userProfile, setUserProfile] = useState(loadedUserProfile);
    
    const { orders } = useOrderContext();
    console.log("orders",orders);

    const { unreadNotif } = useNotificationContext();
    // console.log("Unread",unreadNotif);

    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const searchOrdersFromQuery = (input) => {
        setSearchQuery(input);

        const filteredSuggestions = orders.filter((order)=>{
            return order.title.toLowerCase().includes(searchQuery.toLowerCase())
        })

        setSuggestions(filteredSuggestions.slice(0,5));

    }
    const goToOrder = (id) => {
        setSearchQuery('');
        setSuggestions([]);
        navigate(`./order/${id}`);
    }

    return(
        <div className="nav">           
            <div className="search-nav">
                <input className="search-input" onChange={(e)=>searchOrdersFromQuery(e.target.value)}
                type="text" placeholder="Search categories of orders" />
                {
                    (suggestions.length > 0 && searchQuery) && 
                    <div className='suggestions'>
                        {
                            suggestions?.map((suggestedOrder, index)=>{
                                return(
                                    <div className='suggested' key={index} onClick={()=>goToOrder(suggestedOrder.id)}>
                                        <article>{suggestedOrder.title}</article>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </div>             
            <div className="profile">
                <div>
                    <h2 className="logout" onClick={()=>handleLogOut()}>Logout</h2>
                </div>
                <div className='notif-bell' style={{cursor:'pointer'}} onClick={()=>navigate('./notifications')} >
                    <IoMdNotificationsOutline className='notif-icon'  size={iconSize}/>
                    {
                        unreadNotif.length > 0 &&
                        <div>
                            <article>
                                {
                                unreadNotif.length > 9?
                                '9+':
                                unreadNotif.length
                                }
                            </article>
                        </div>
                    }
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
        </div>
    );
};

export default Navbar;