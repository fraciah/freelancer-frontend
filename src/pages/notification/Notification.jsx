import React from 'react';
import { IoMdNotificationsOutline } from "react-icons/io";
import { timeAgo } from '../../../utils/helpers/TimeAgo';
import{ useNavigate } from 'react-router-dom';
import { MdNotificationAdd } from "react-icons/md";
import { useNotificationContext } from '../../providers/NotificationProvider';
import './notification.css';

const Notification = () => {

    const navigate = useNavigate();
    
    const { notifications, loading, markNotificationRead } = useNotificationContext();            

    const navigateToOrder = (orderId, notifId) => {
        orderId && navigate(`../order/${orderId}`);
        markNotificationRead(notifId);
    }      

    return (
        <div className='notifications'>
            {
               loading ?
               <div className='notif-skeleton'>
                    <div className='notif-skeleton-content'>
                        <div className='notif-sk-circle'></div>
                        <div className='notif-sk-box'>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <div className='notif-skeleton-content'>
                        <div className='notif-sk-circle'></div>
                        <div className='notif-sk-box'>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <div className='notif-skeleton-content'>
                        <div className='notif-sk-circle'></div>
                        <div className='notif-sk-box'>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <div className='notif-skeleton-content'>
                        <div className='notif-sk-circle'></div>
                        <div className='notif-sk-box'>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
               </div>                    
               :
               notifications.length > 0 ?
                notifications?.map((notification, index)=>{
                    return (
                        <div style={{backgroundColor:notification?.read_status?'#eeeeee':''}} onClick={()=>navigateToOrder(notification.order_id, notification.id)} className='notif-box' key={index}>
                            <IoMdNotificationsOutline size={30}/>
                            <div className='notif-message'>
                                <article>{notification.message}</article>
                            </div>  
                            <div className='notif-duration'>
                                <article>{timeAgo(notification.created_at)}</article>        
                                {
                                    !notification?.read_status &&
                                    <div className='notif-circle' style={{
                                    width:'10px',
                                    height:'10px',
                                    borderRadius:'50%'
                                }}></div> 
                                }                         
                            </div>
                        </div>
                        )
                }):
                <div className='no-notif'>
                    <div className='notif-child-box'>
                        <article>New notifications will appear here, hang on!</article>
                        <MdNotificationAdd size={120} className='placeholder-icon' />
                    </div>
                </div>                
            }                                
        </div>
    );
}

export default Notification;