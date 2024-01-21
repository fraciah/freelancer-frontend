import React from 'react';
import './sidenav.css';
// import gigitise from '../../../../public/gigitise.svg';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdAdd, MdTaskAlt, MdPendingActions, MdAccessTime } from 'react-icons/md';
import { FiMenu } from "react-icons/fi";
import { FaClockRotateLeft } from "react-icons/fa6";

const SideNav = () => {
    const navigate = useNavigate();   
    const iconSize = 25;

    return (
        <div className='side-nav'>
            <h1 style={{cursor:'pointer'}} className='heading-logo'  onClick={()=>navigate('./')}>
                {/* <img src={gigitise} style={{width:'3rem', color:'white'}} alt="" /> */}
                Gigitise
            </h1>
            <div className='actions'>
                <Link to='/app' className="nav-item ">
                    <FiMenu size={iconSize}/>
                    Dashboard
                </Link>
                <Link to='./available' className="nav-item">
                <FaClockRotateLeft size={iconSize}/>
                   Available
                </Link>
                <Link to='./Bid-view' className="nav-item">
                <MdAccessTime  size={iconSize}/>
                    My Bids
                </Link>
                <Link to='./in-progress' className="nav-item">
                    <MdPendingActions size={iconSize}/>
                    In Progress
                </Link>
                
                <Link to='./completed' className="nav-item">
                    <MdTaskAlt size={iconSize}/>
                    Completed
                </Link>
            </div>
        </div>
    );
}

export default SideNav;