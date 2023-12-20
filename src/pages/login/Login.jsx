import React from 'react';
import './login.css';
import { useAuthContext } from '../../comppnents/providers/AuthProvider';
import { IoLogoIonic } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import { MdLock } from "react-icons/md";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useState, useEffect, useRef } from 'react';
import LoadingDots from "../../icons/loading-dots";
import { Navigate,} from 'react-router-dom';
import { toast } from "react-hot-toast"
import gigitise from '../../../public/gigitise.svg';

const Login = () => {
  const iconSize = 30;
  const { loginError, handleLogin, loading } = useAuthContext();
  const [visible, setVisible] = useState(false);
  const passwordRef = useRef();
  const [password, setPassword] = useState('');
  
    const togglePassword = ()=> {
        setVisible(!visible);
    }

    useEffect(()=>{
        if (loginError.error){
            setPassword('');
            console.log('Error')
        }
    },[loginError]);
    
    const authContext = useAuthContext();
    console.log(authContext);

  return (
    <div className="container">
    <div className="brand-logo">
      <img src={gigitise} style={{ width: '6rem' }} alt="logo" />
    </div>
    <div className="brand-title">Gigitise</div>
    <form onSubmit={handleLogin} className="inputs">
      <div className='login-content'>
        <FiUser className='username-icon' size={iconSize} />
        <input 
        required 
        id='username' 
        type="text" 
        placeholder='Username'
        />
      </div>
      <div className='login-content'>
        <MdLock className='password-icon' size={iconSize} />
        <input required id='password' ref={passwordRef}   type={visible ? "text" : "password"} placeholder='Password' />
        {
          visible ?
            <IoEye onClick={togglePassword} className='password-icon-eye' size={20} /> :
            <IoEyeOff onClick={togglePassword} className='password-icon-eye' size={20} />
        }
      </div>
      <button type="button" onClick={handleLogin}>
      {loading ? <LoadingDots color='#1387E6' size={15} /> : 'Sign In'}
      </button>
    </form>
    <div className="card_info">
    <p>Not registered? <a href="#">Create an account</a></p>
    </div>
  </div>
  );
}

export default Login;
