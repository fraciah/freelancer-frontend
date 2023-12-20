
import './App.css'
import Login from './pages/login/Login';
import { Route, Routes } from 'react-router-dom';
import { useAuthContext } from './comppnents/providers/AuthProvider';

function App() {
  const { userToken } = useAuthContext();
  return (
    <>
      <Routes>
        <Route path='/app' element={userToken?<Main/>:<Login/>}/>
      </Routes>
    </>
  )
}

export default App
