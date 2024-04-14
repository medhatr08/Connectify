import React, { useState } from 'react'

import "../css/Signup.css"
import { Link,useNavigate } from "react-router-dom";
import {toast} from "react-toastify"

export default function Signup() {
  const navigate=useNavigate()
  const [name, setName] = useState("")
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // toast functions

  const notifyA=(msg)=>toast.error(msg)
  const notifyB=(msg)=>toast.success(msg)

  const emailRegex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/

  const postData = () => {
    //checking email
    if(!emailRegex.test(email)){
      notifyA("Invalid email");
      return;
    }else if(!passRegex.test(password)){
      notifyA("Password must contain at least eight characters, inckuding at least one number and losercase and uppercase letters and special characters for example #,?,!")
      return;
    }
    //sending data to server
    fetch("http://localhost:5000/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        userName: userName,
        email: email,
        password: password
      })

    }).then(res=>res.json()).then(data=>{
      if(data.error){
        notifyA(data.error)
      }else{
        notifyB(data.message)
        navigate("/signin")
      }
      console.log(data)
    })

  }
  return (
    <>

    <div className='signup'>
      {/* <div className='imageDiv'><img className='image'  src='https://static.vecteezy.com/system/resources/thumbnails/002/214/392/small/flat-design-concept-social-network-peoples-connecting-around-the-world-with-line-and-avatar-icon-illustrate-free-vector.jpg'/></div> */}
      <div className='form-container'>
        <div className='form'>
          <div className='signuplogo'>
            <span >Connectify</span>
          </div>
          <p className='loginPara'>
            Sign up to see photos and videos<br /> from your friends
          </p>

          <div>
            <input type='email' name='email' id='email' value={email} placeholder='Email' onChange={(e) => { setEmail(e.target.value) }} />
          </div>
          <div>
            <input type='text' name='name' id='name' placeholder='Full Name' value={name} onChange={(e) => { setName(e.target.value) }} />
          </div>
          <div>
            <input type='text' name='username' id='username' placeholder='Username' value={userName} onChange={(e) => { setUserName(e.target.value) }} />
          </div>

          <div>
            <input type='password' name='password' id='password' placeholder='Password' value={password} onChange={(e) => { setPassword(e.target.value) }} />
          </div>
          <p className='loginPara' style={{ fontSize: "12px", margin: "3px 0px", }}>
            By signing up, you agree to out Terms,<br /> privacy policy and cookies policy .
          </p>
          <input type="submit" id='submit-btn' value="Sign Up" onClick={postData} />
        </div>

        <div className='form2'>
          Already have an account ?
          <Link to="/signin"><span style={{ color: "blue", cursor: "pointer" }}>Sign In</span></Link>
        </div>
      </div>
    </div>
    </>
  )
}
