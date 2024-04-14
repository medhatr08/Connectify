import React, { useEffect, useState } from 'react'
import "../css/Home.css"
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify"
import noPhoto from "../img/noPhoto.png"

export default function Home() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [comment, setComment] = useState("")
  const [show, setShow] = useState(false)
  const [item, setItem] = useState([])
  const [isFollow, setIsFollow] = useState(false)


  const notifyB = (msg) => toast.success(msg)

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/signin")
    }

    //Fetch a req

    fetch("http://localhost:5000/allposts", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res =>
      res.json()).then(result => {
        
        
        setData(result)
       
      }).catch(err =>
        console.log(err))

  }, [])

  // to show and hide comment section

  const toggleComment = (posts) => {
    if (show) {
      setShow(false)
    }
    else {
      setShow(true)
      setItem(posts)

    }
  }

  const likePost = (id) => {
    fetch("http://localhost:5000/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts && posts._id && result && result._id && posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        
        setData(newData);
      })
      .catch((error) => console.log(error));
  };


  const unLikePost = (id) => {
    fetch("http://localhost:5000/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts && posts._id && result && result._id && posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });

        setData(newData);
      })
      .catch((error) => console.log(error));
  };




  //to comment
  const makeComment = (text, id) => {
    fetch("http://localhost:5000/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        text: text,
        postId: id
      })
    }).then(res => res.json()).then((result) => {

      const newData = data.map((posts) => {
        if (posts && posts._id && result && result._id && posts._id === result._id) {
          return result;
        } else {
          return posts;
        }
      });
      setData(newData)
      setComment("")
      notifyB("Comment Posted")
    })
  }

  const followUser = (userId) => {
    fetch("http://localhost:5000/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
   
      .then(res => res.json())
      
      .then((data) => {
        
        setIsFollow(true);
      })
      .catch((error) => console.log(error));
  };

  // Unfollow user
  const unfollowUser = (userId) => {
    try{
    fetch("http://localhost:5000/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
    
      
    .then(res => res.json())
      
    .then((data) => {
     
      setIsFollow(false);
    })
      
    }
      catch(error){ console.log(error)};
  };

  return (
    <div className='home'>
      {/* card */}
      
      {data && Array.isArray(data) && data.map((posts) => (
  <div className='card' key={posts._id}> {/* Make sure to provide a unique key */}
    {/* Card header */}
    <div className='card-header'>
      <div className='card-pic'>
        <img src={posts.postedBy?.Photo ? posts.postedBy.Photo : noPhoto} alt='cardpic' />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h5>
          <Link to={(posts.postedBy?._id && posts.postedBy?._id !== JSON.parse(localStorage.getItem("user"))._id) ? `/profile/${posts.postedBy._id}` : "/profile"}>
            {posts.postedBy?.userName}
          </Link>
        </h5>
        {(posts.postedBy?._id && posts.postedBy?._id !== JSON.parse(localStorage.getItem("user"))._id) &&
          (<button className='followBtn' onClick={() => {
            
            if (isFollow) {
              
              unfollowUser(posts.postedBy?._id)
            } else {

              followUser(posts.postedBy?._id)
            }
          }}>
            {isFollow ? "Unfollow" : "Follow"}
          </button>)
        }
      </div>
    </div>
    {/* Card Image */}
    <div className='card-img'>
      <img width="100px" src={posts.photo} alt='postpic' />
    </div>
    {/* card Content */}
    <div className='card-content'>
      {
        posts.likes.includes(JSON.parse(localStorage.getItem("user"))._id) ?
          (<span onClick={() => { unLikePost(posts._id) }} className="material-symbols-outlined material-symbols-outlined-red">favorite</span>) :
          (<span onClick={() => { likePost(posts._id) }} className="material-symbols-outlined">favorite</span>)
      }
      <p>{posts.likes.length} Likes</p>
      <p>{posts.body}</p>
      <p style={{ fontWeight: "bold" }}>Total Comments <span>{posts.comments.length}</span> </p>
      <p onClick={() => { toggleComment(posts) }} style={{ fontWeight: "bold", cursor: "pointer" }}>View All Comments</p>
    </div>
    {/* add comment */}
    <div className='add-comment'>
      <span className="material-symbols-outlined">mood</span>
      <input type='text' value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Add a Comment' />
      <button className='comment' onClick={() => makeComment(comment, posts._id)}>Post</button>
    </div>
  </div>
))}

      {/* //showComments */}
      {
        show && (
          <div className='showComment'>
            <div className='container'>
              <div className='postPic'>
                <img src={item.photo} alt='postpic' />
              </div>
              <div className='details'>
                {/* Card header */}
                <div className='card-header' style={{ borderBottom: "1px solid #00000029" }}>
                  <div className='card-pic'>
                    <img src={item.postedBy?.Photo ? item.postedBy.Photo : noPhoto} alt='cardpic' />
                  </div>
                  <h5>{item.postedBy?._id && item.postedBy?.userName}</h5>
                </div>
                {/* Commentsection */}
                <div className='comment-section' style={{ borderBottom: "1px solid #00000029" }}>
                  {item.comments.map((comment) => {
                    return (<p className='comments'>
                      <span className='commenter' style={{ fontWeight: "bolder" }}>{comment.postedBy?._id && comment.postedBy?.userName} </span>
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
                  <input type='text' value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Add a Comment' />
                  <button className='comment' onClick={() => { makeComment(comment, item._id); toggleComment() }} >Post</button>
                </div>}
              </div>
            </div>
            <div className='close-icon' onClick={() => toggleComment()}>
              <span className="material-symbols-outlined material-symbols-outlined-comment">close</span>
            </div>
          </div>)
      }

    </div>
  )
}
