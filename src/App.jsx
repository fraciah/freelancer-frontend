import './App.css'
import Login from './pages/login/Login';
import { Route, Routes } from 'react-router-dom';
import { useAuthContext } from './providers/AuthProvider';
import Navbar from './components/navbar/Navbar';
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/profile/Profile';

function App() {
  const { userToken } = useAuthContext();

  const Main = () => {
    return (
      <>
        <Navbar />
        {/* <Dashboard /> */}
        <Routes>
          <Route path='profile' element={<Profile/>}/>
          {/* Dashboard route here */}
          {/* Profile route here */}
          {/* ...etc... */}
        </Routes>
      </>      
    )
  }
  return (
    <>
      <Routes>
        <Route path='/app/*' element={userToken?<Main/>:<Login/>}/>
      </Routes>
    </>
  )
}

export default App
