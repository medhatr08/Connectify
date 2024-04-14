import React,{useContext} from 'react'
import '../css/Navbar.css'
import { Link } from 'react-router-dom';
import { LoginContext } from '../context/LoginContext';


export default function Navbar({login}) {
  const {setModalOpen}=useContext(LoginContext)
  const loginStatus = () => {
    const token = localStorage.getItem("jwt")
    if (login || token) {
      return [
        <>
          <Link to="/profile"> <li>Profile</li></Link>
          <Link to="/messages">
            <li>Messages</li>
          </Link>
          <Link to={""}>
            <button className="primaryBtn" onClick={()=>setModalOpen(true)}>Logout</button>
          </Link>
        </>
      ]
    } else {
      return [
        <>
          <Link to="/signup"> <li>SignUp</li></Link>
          <Link to="/signin" ><li>SignIn</li></Link>
        </>
      ]
    }
  }
 
  return (
    <div className='navbar'>
      <Link to="/"><div className='logo'><span className='logo'>Connectify</span></div></Link>
      <ul className='nav-menu'>
      {loginStatus()}

      </ul>
    </div>
  )
}
