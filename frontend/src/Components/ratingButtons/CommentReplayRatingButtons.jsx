import React, { useEffect, useState } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { Button } from '@material-ui/core';
import { ThumbDown, ThumbUp } from '@material-ui/icons';

import { useSelector, useDispatch } from 'react-redux';
import { userSelector, fetchUserBytoken } from '../../store/UserSlice';

const ReplyCommentRatingButtons = (props) => {
  const {uid, username, authenticated } = useSelector(userSelector);
  const [isLiking, setIsLiking] = useState(null);
  const [isDisLiking, setIsDisLiking] = useState(null);
  const [likes_count, setlikes_count] = useState(0);
  const [dislikes_count, setdislikes_count] = useState(0);


  useEffect(() => {
    console.log(props);
    refresh();
  }, [])

  const refresh = () =>{
    axios
    .get(`http://localhost:8000/api/reply-comment-ratings/?user=${uid}&reply_comment=${props.replyComment}`, {
      headers: {
        Authorization: Cookie.get('access_token')
        ? `JWT ${Cookie.get('access_token')}`
        : null,
        accept: 'application/json',
      },
    })
    .then((response) => {
      console.log(response.data)    
      try {
        setlikes_count(response.data[0].likes_count);
        setdislikes_count(response.data[0].dislikes_count);
        setIsLiking(response.data[0].is_liking);
        setIsDisLiking(response.data[0].is_disliking);
      }catch(e){
        console.log(e);
      }
      })
    .catch((error) => {
        console.log(error);
    })
  }

  function handleLiking() {
    let data = {
      reply_comment: props.replyComment,
      user: uid,
      is_liking: true,
      is_disliking: false,
    }
    axios
    .post(`http://localhost:8000/api/reply-comment-ratings/`, data ,{
      headers: {
        Authorization: Cookie.get('access_token')
        ? `JWT ${Cookie.get('access_token')}`
        : null,
        accept: 'application/json',
      },
    })
    .then((res) => {
      // console.log(res);
      refresh();
      // console.log(res);
      // setIsLiking(true);
      // setIsDisLiking(false);
    })
  }

  function handleDisliking() {
    console.log('Disliking');
    let data = {
      reply_comment: props.replyComment,
      user: uid,
      is_liking: false,
      is_disliking: true,
    }
    axios
    .post(`http://localhost:8000/api/reply-comment-ratings/`, data ,{
      headers: {
        Authorization: Cookie.get('access_token')
        ? `JWT ${Cookie.get('access_token')}`
        : null,
        accept: 'application/json',
      },
    })
    .then((res) => {
      refresh()
      // setIsLiking(false);
      // setIsDisLiking(true);
    })
  }

  function handleUnLiking() {
    let data = {
      reply_comment: props.replyComment,
      user: uid,
      is_liking: false,
      is_disliking: false,
    }
    axios
    .post(`http://localhost:8000/api/reply-comment-ratings/`, data ,{
      headers: {
        Authorization: Cookie.get('access_token')
        ? `JWT ${Cookie.get('access_token')}`
        : null,
        accept: 'application/json',
      },
    })
    .then((res) => {
      refresh();
      // setIsLiking(false);
    })
  }

  function handleUnDisliking() {
    console.log('UnDisliking');
    let data = {
      reply_comment: props.replyComment,
      user: uid,
      is_liking: false,
      is_disliking: false,
    }
    axios
    .post(`http://localhost:8000/api/reply-comment-ratings/`, data ,{
      headers: {
        Authorization: Cookie.get('access_token')
        ? `JWT ${Cookie.get('access_token')}`
        : null,
        accept: 'application/json',
      },
    })
    .then((res) => {
      refresh()
      // setIsDisLiking(false);
    })
  }


  // if (!isLogged)
  // return (
  //   <>
  //     <Button startIcon={<ThumbUp />}>{likesCount}</Button>
  //     <Button startIcon={<ThumbDown />}>{dislikesCount}</Button>
  //   </>
  // );

  return (
    <>
    {/* <button onClick={ass}>test</button> */}
      {/* {status === 'loading' ? (
        <div>loading...</div>
      ) : status === 'error' ? (
        <div>{error?.message || error}</div>
      ) : ( */}
        <>
          <Button
            startIcon={<ThumbUp />}
            onClick={() => {
              if (isLiking === false) {
                handleLiking();
              } else {
                handleUnLiking();
              }
            }}
            color={isLiking ? 'primary' : 'default'}>
            {likes_count}
          </Button>
          <Button
            startIcon={<ThumbDown />}
            onClick={() => {
              if (isDisLiking === false ) {
                handleDisliking();
              } else {
                handleUnDisliking();
              }
            }}
            color={isDisLiking ? 'primary' : 'default'}>
            {dislikes_count}
          </Button>
        </>
      {/* )} */}
    </>
  );
};

export default ReplyCommentRatingButtons;
