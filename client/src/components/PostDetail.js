import React from 'react'
import "../css/PostDetail.css"
import { useNavigate } from 'react-router-dom'
import {toast} from "react-toastify"
export default function PostDetail({ item, toggleDetails }) {
    const notifyB=(msg)=>toast.success(msg)
    const navigate=useNavigate()
    const deletePosts = (postId) => {
        fetch(`http://localhost:5000/deletePost/${postId}`, {
           
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
        }).then((res) => res.json()).then(result => {
            notifyB(result.msg)
            toggleDetails()
            navigate("/")
           
        })
    }
    return (
        <div className='showComment'>
            <div className='container'>
                <div className='postPic'>
                    <img src={item.photo} alt='postpic' />
                </div>
                <div className='details'>
                    {/* Card header */}
                    <div className='card-header' style={{ borderBottom: "1px solid #00000029" }}>
                        <div className='card-pic'>
                            <img src='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww' alt='cardpic' />
                        </div>
                        <h5>{item.postedBy.name}</h5>
                        <div className='deletePost' onClick={()=>{deletePosts(item._id)}}>
                            <span className="material-symbols-outlined">delete</span>
                        </div>
                    </div>
                    {/* Commentsection */}
                    <div className='comment-section' style={{ borderBottom: "1px solid #00000029" }}>
                        {item.comments.map((comment) => {
                            return (<p className='comments'>
                                <span className='commenter' style={{ fontWeight: "bolder" }}>{comment.postedBy.userName} </span>
                                <span className='commentText'>{comment.comment}</span>
                            </p>)
                        })}


                    </div>
                    {/* card Content */}
                    <div className='card-content'>

                        <p>{item.likes.length} Likes</p>
                        <p>{item.body}</p>
                    </div>
                    {/* add comment */}

                    {<div className='add-comment'>
                        <span className="material-symbols-outlined">mood</span>
                        <input type='text'
                            //   value={comment} onChange={(e) => setComment(e.target.value)} 
                            placeholder='Add a Comment' />
                        <button className='comment'
                        //</div>onClick={()=> {makeComment(comment, item._id); toggleComment()}} 
                        >Post</button>
                    </div>}
                </div>
            </div>
            <div className='close-icon'
                onClick={() => toggleDetails()}
            >
                <span className="material-symbols-outlined material-symbols-outlined-comment">close</span>
            </div>
        </div>
    )
}
