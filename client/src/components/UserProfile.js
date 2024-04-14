import React,{useEffect,useState} from 'react'
import "../css/Profile.css"

import {useParams}from"react-router-dom"
import noPhoto from "../img/noPhoto.png"
export default function UserProfile() {
    const {userid}=useParams();
  const [user,setUser]=useState("")
  const [isFollow,setIsFollow]=useState(false)

  const [posts,setPosts]=useState([])



//function to follow user
  const followUser=(userId)=>{
    fetch("http://localhost:5000/follow",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        Authorization:"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        followId:userId
      })
    }).then((res)=>res.json()).then((data)=>{
      
      setIsFollow(true)
    })
  }

  //function to unfollow user
  const unfollowUser=(userId)=>{
    fetch("http://localhost:5000/unfollow",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        Authorization:"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        followId:userId
      })
    }).then((res)=>res.json()).then((data)=>{
      
      setIsFollow(false)
    })
  }

  useEffect(()=>{
    fetch(`http://localhost:5000/user/${userid}`,{
      headers:{
        Authorization:"Bearer "+localStorage.getItem("jwt")
      }

    }).then((res)=>res.json()).then((result)=>{
      
      setUser(result.user)
      setPosts(result.post)
      if(result.user.followers.includes(JSON.parse(localStorage.getItem("user"))._id)){
        setIsFollow(true);
      }
    })

  },[isFollow])
  return (
    <div className='profile'>
      {/* ProfileFrame */}
      <div className='profile-frame'>
        {/* profilepic */}
        <div className='profile-pic'>
          <img src={user.Photo?user.Photo:noPhoto} alt='profilepic'/>

        </div>
        {/* profiledata */}
        <div className='profile-data'>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <h1 className='name'>{user.userName}</h1>
          <button onClick={()=>{
            if(isFollow){
              unfollowUser(user._id)
            }
            else{
              followUser(user._id)
            }
            
            }} className='followBtn'>
           {isFollow?"Unfollow":"Follow"}
            </button>
          </div>
          
          <div className='profile-info' style={{display:"flex"}}>
            
            <p>{posts.length} posts</p>
            <p> {user.followers?user.followers.length:"0"} followers </p>
            <p>{user.following?user.following.length:"0"} following</p>
          </div>
        </div>
      </div>
<hr style={{width:"90%",margin:"25px auto",opacity:"0.8"}} />
      {/* Gallery */}
      <div className='gallery'>
      {posts.map((pics)=>{
        return <img
        //  onClick={()=>toggleDetails(pics)} 
         key={pics._id} src={pics.photo} alt='myposts' className='item'/>
      })}
      </div>
      {/* {show &&
        <PostDetail item={posts} toggleDetails={toggleDetails}  />
      } */}
    </div>
  )
}
