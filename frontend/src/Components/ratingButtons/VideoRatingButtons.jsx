import React, { useEffect } from 'react';
import { Button } from '@material-ui/core';
import { ThumbDown, ThumbUp } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { userSelector } from '../../store/UserSlice';
import { like, dislike, unlike, undislike,} from '../../store/VideoRatingsSlice';
import { FetchVideoRating } from '../../store/VideoRatingsSlice';

const VideoRatingButtons = (props) => {
  const {uid, authenticated } = useSelector(userSelector);
  const ratings = useSelector(state => state.videorating);
  const {isLiking, isDisLiking, likesCount, dislikesCount, Ready} = ratings;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(FetchVideoRating({
      uid : uid, 
      videoId: props.video,
    }))
  }, [])


  function handleLiking() {
    dispatch(like({
      uid : uid, 
      videoId: props.video,
    }))
  }

  function handleDisliking() {
    // console.log("Disliking called");
    dispatch(dislike({
      uid : uid, 
      videoId: props.video,
    }))
  }

  function handleUnLiking() {
    dispatch(unlike({
      uid : uid, 
      videoId: props.video,
    }))
  }

  function handleUnDisliking() {
    // console.log("unDisliking called");
    dispatch(undislike({
      uid : uid, 
      videoId: props.video,
    }))
  }

  // function test(){
  //   console.log(isLiking, isDisLiking, likesCount, dislikesCount);
  // }
  if (!{authenticated})
    return (
      <>
        <Button startIcon={<ThumbUp/>}>{likesCount}</Button>
        <Button startIcon={<ThumbDown/>}>{dislikesCount}</Button>
      </>
    );
  
  return (
    <>
    {/* <Button onClick={test}>test</Button> */}
      <Button
        startIcon={<ThumbUp />}
        onClick={() => {
          if (isLiking === false ) {
            handleLiking();
          } else {
            handleUnLiking();
          }
        }}
        color={isLiking ? 'primary' : 'default'}>
        {likesCount}
      </Button>
      <Button
        startIcon={<ThumbDown />}
        onClick={() => {
          if (isDisLiking === false) {
            handleDisliking();
          } else {
            handleUnDisliking();
          }
        }}
        color={isDisLiking ? 'primary' : 'default'}>
        {dislikesCount}
      </Button>
    </>
  )
}

export default VideoRatingButtons;
