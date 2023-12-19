import React  from 'react';
import './login.css';
//import { useAuthContext } from '../../../providers/AuthProvider';
import { IoLogoIonic } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import { MdLock } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useState } from 'react';
import  LoadingDots from "../../icons/loading-dots";
import { useEffect } from 'react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gigitise from '../../../public/gigitise.svg';
// import { IoMdEye } from "react-icons/md";
// import { IoMdEyeOff } from "react-icons/md";


const Login = () => {
    const iconSize = 30;
    //const { loginError, handleLogin, loading } = useAuthContext();
    const [visible, setVisible] = useState(false);
    const passwordRef = useRef();
    const [password, setPassword] = useState('');
    
    const togglePassword = ()=> {
        setVisible(!visible);
    }

    return (
<div class="container">
  <div class="brand-logo">
  <img src={gigitise} style={{width:'6rem'}} alt="logo" />
  </div>
  <div class="brand-title">Gigitise</div>
  <form class="inputs">
    <div className='login-content'>
      <FiUser className='username-icon' size={iconSize}/>
        <input required id='username' type="text" placeholder='Username' />                    
    </div>
    <div className='login-content'>
                        <MdLock className='password-icon' size={iconSize}/>
                        <input required id='password' ref={passwordRef} value={password} onChange={(e)=>setPassword(e.target.value)} type={visible?"text":"password" } placeholder='Password' />  
                        {
                            visible?
                            <IoEye onClick={togglePassword} className='password-icon-eye' size={20} />:
                            <IoEyeOff onClick={togglePassword} className='password-icon-eye' size={20} />                                              
                        }
                    </div>
    <button type="submit">Sign In</button>
  </form>
</div>
    );
}

export default Login;
