import React,{useEffect,useState} from 'react'
import "../css/Profile.css"
import PostDetail from '../components/PostDetail'
import ProfilePic from '../components/ProfilePic'
import noPhoto from "../img/noPhoto.png"
import { Link } from 'react-router-dom'

export default function Profile() {
  const [pic,setPic]=useState([])
  const [show,setShow]=useState(false)
  const [posts,setPosts]=useState([])
  const[changePic,setChangePic]=useState(false)
  const [user,setUser]=useState("")



  const toggleDetails=(postss)=>{
    if(show){
      setShow(false)
    }
    else{
      setShow(true)
      setPosts(postss)
      
    }
  }
  
  useEffect(()=>{
    const res=fetch(`http://localhost:5000/user/${JSON.parse(localStorage.getItem("user"))._id}`,{
      headers:{
        Authorization:"Bearer "+localStorage.getItem("jwt")
      }

    }).then((res)=>res.json()).then((result)=>{
      console.log(result)
      setPic(result.post)
      setUser(result.user)
    })

  },[])

  const changeProfile=()=>{
    if(changePic)
    setChangePic(false)
    else{
      setChangePic(true)
    }
  }
  

  return (
    <div className='profile'>
      {/* ProfileFrame */}
      <div className='profile-frame'>
        {/* profilepic */}
        <div className='profile-pic'>
          <img onClick={changeProfile} src=
          {user.Photo?user.Photo:noPhoto}
           alt='profilepic'/>

        </div>
        {/* profiledata */}
        <div className='profile-data'>
          <h1>{JSON.parse(localStorage.getItem("user")).userName}</h1>
          <div className='profile-info' style={{display:"flex"}}>
          
            <p>{pic.length?pic.length:"0"} posts</p>
            <p> {user.followers?user.followers.length:"0"} followers </p>
            <p>{user.following?user.following.length:"0"} following</p>
          </div>
        </div>
      </div>
<hr style={{width:"90%",margin:"25px auto",opacity:"0.8"}} />
      {/* Gallery */}
      
      <div className='gallery'>
      {pic.map((pics)=>{
        
        return <img onClick={()=>toggleDetails(pics)} key={pics._id} src={pics.photo} alt='myposts' className='item'/>
      })}
      </div>
      <div style={{margin:"50px"}}>
        <Link to="/createPost"><span style={{
          fontSize: "15px",
          fontWeight:" bold",
          color: "rgb(193 193 232)",
          backgroundColor:" #373636",
          border: "1px solid black",
          borderRadius: "6px",
          
          padding: "7px"}}>Add Post</span></Link>
      </div>
      {show &&
        <PostDetail item={posts} toggleDetails={toggleDetails}  />
      }
      {
        changePic && <ProfilePic changeProfile={changeProfile}/>
      }
    </div>
  )
}
