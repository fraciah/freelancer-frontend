import './App.css'
import Login from './pages/login/Login';
import { Route, Routes } from 'react-router-dom';
import { useAuthContext } from './providers/AuthProvider';
import Navbar from './components/navbar/Navbar';

function App() {
  const { userToken } = useAuthContext();
  return (
    <>
      <Routes>
        <Route path='/app' element={userToken?<Main/>:<Login/>}/>
        <Route path='/navbar' element={<Navbar/>}/>
      </Routes>
    </>
  )
}

export default App
