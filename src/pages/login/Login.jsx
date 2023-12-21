import React from 'react';
import './login.css';
import { useAuthContext } from '../../providers/AuthProvider';
import { FiUser } from "react-icons/fi";
import { MdLock } from "react-icons/md";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useState, useEffect, useRef } from 'react';
import LoadingDots from "../../icons/loading-dots";
import { toast } from "react-hot-toast"
import gigitise from '../../../public/gigitise.svg';

const Login = () => {
  const iconSize = 30;
  const { loginError, handleLogin, loading } = useAuthContext();
  const [visible, setVisible] = useState(false);
  const passwordRef = useRef();
  const [password, setPassword] = useState('');
  
  const togglePassword = () => {
    setVisible(!visible);
  }

  useEffect(() => {
    if (loginError.error) {
      setPassword('');
      toast.error(`Login failed: ${loginError.error}`);
    }
  }, [loginError]);

  const notifyLoginSuccess = () => {
    toast.success('Login successful!'); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    if (!username || !password) {
      toast.error('Username and password are required.');
      return;
    }

    toast.loading('Logging in...');
    handleLogin(notifyLoginSuccess);
  };

  return (
    <div className="btn">
      <div className="brand-logo">
        <img src={gigitise} style={{ width: '6rem' }} alt="logo" />
      </div>
      <div className="brand-title">Gigitise</div>
      <form onSubmit={handleSubmit} className="inputs">
        <div className='login-content'>
          <FiUser className='username-icon' size={iconSize} />
          <input 
            required 
            id='username' 
            className=''
            type="text" 
            placeholder='Username'
          />
        </div>
        <div className='login-content '>
          <MdLock className='password-icon' size={iconSize} />
          <input 
            required 
            id='password' 
            ref={passwordRef}  
            type={visible ? "text" : "password"} 
            placeholder='Password' 
          />
          {
            visible ?
              <IoEye onClick={togglePassword} className='password-icon-eye' size={20} /> :
              <IoEyeOff onClick={togglePassword} className='password-icon-eye' size={20} />
          }
        </div>
        <button type="submit">
          {loading ? <LoadingDots color="#1387E6" size={15} /> : 'Sign In'}
        </button>
      </form>

    </div>
  );
}

export default Login;
