import React,{useEffect,useState,useRef} from 'react'

export default function ProfilePic({changeProfile}) {
  const hiddenFileInput=useRef(null)
  const [image,setImage]=useState("")
  const [url,setUrl]=useState("")

  const postDetails = () => {
        
    const data = new FormData();
    data.append("file", image)
    data.append("upload_preset", "Connectify");
    data.append("cloud_name", "medhacloud")
    fetch("https://api.cloudinary.com/v1_1/medhacloud/image/upload", {
        method: "Post",
        body: data
    }).then(res => res.json()).then(data => {
       
        setUrl(data.url)
    }).catch(err => {
        console.log(err)
    })

}
const postPic=async()=>{
 
    //saving post to mongodb
    try{
    const res=await fetch("http://localhost:5000/uploadProfilePic", {
        method: "Put",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({pic: url
})
    })
    console.log(res)
          changeProfile()
          window.location.reload()
        }catch(err) { console.log(err) }


}
useEffect(()=>{
  if(image)
  postDetails()

},[image])

useEffect(()=>{
  if (url) {
    //saving post to mongodb
    postPic()
  }
},[url])

  const handleClick=()=>{
    hiddenFileInput.current.click();
  }

  return (
    <div className='profilepic darkBg'>
      <div className='changePic centered'>
        <div>
          <h2>Change Profile Photo</h2>
        </div>
        <div style={{borderTop:"1px solid #00000030"}} ><button onClick={handleClick} className='upload-btn' style={{color:"#1EA1F7"}}> Upload Photo</button>
        <input ref={hiddenFileInput} type='file' accept='image/*' style={{display:"none"}} 
        onChange={(e)=>{
            setImage(e.target.files[0])
        }}/>
        </div>
        <div style={{borderTop:"1px solid #00000030"}}>
          <button onClick={()=>{
            setUrl(null)
            postPic()
          }} className='upload-btn' style={{color:"#ED4956"}}>Remove Current Photot</button>
        </div>
        <div style={{borderTop:"1px solid #00000030"}}>
          <button style={{background:"none",border:"none",cursor:"pointer",fontSize:"15px"}}
            onClick={changeProfile}
          >Cancel</button>
        </div>
      </div>
    </div>
  )
}
