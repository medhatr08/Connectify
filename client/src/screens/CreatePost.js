import React, { useState, useEffect } from 'react';
import '../css/CreatePost.css'
import {toast} from "react-toastify"
import {useNavigate} from "react-router-dom"

export default function CreatePost() {
    const navigate=useNavigate();
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

    const notifyA=(msg)=>toast.error(msg)
    const notifyB=(msg)=>toast.success(msg)


    useEffect(() => {
        if (url) {
            //saving post to mongodb
            fetch("http://localhost:5000/createPost", {
                method: "Post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    body,
                    pic: url
                })
            }).then(res => res.json()).then(data =>
                {
                    if(data.error){
                    notifyA(data.error)
                }else{
                    notifyB("Succesfully Posted")
                    navigate("/")
                }}).catch((err) => { console.log(err) })
        }



    }, [url])

    // posting image to cloudinary
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
    const loadfile = (e) => {
        var output = document.getElementById('output');
        output.src = URL.createObjectURL(e.target.files[0]);
        output.onload = function () {
            URL.revokeObjectURL(output.src);
        }
    }
    return (
        <div className='createPost'>
            {/* header */}
            <div className='post-header'>
                <h4 style={{ margin: "3px auto" }}>Create New Post</h4>
                <button onClick={postDetails} id='post-btn'>Share</button>
            </div>
            {/* image preview */}
            <div className='main-div'>
                <img id='output' src='https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png' />
                <input type='file' accept='image/*' onChange={(e) => {
                    loadfile(e);
                    setImage(e.target.files[0])
                }} />
            </div>
            {/* details */}
            <div className='details'>
                <div className='card-header'>
                    <div className='card-pic'>
                        <img width="50px" src='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww' alt='pic' />
                    </div>
                    <h5>Medha</h5>
                </div>
                <textarea value={body} onChange={(e) => { setBody(e.target.value) }} type="text" placeholder='Write a Caption'></textarea>
            </div>

        </div>
    )
}
