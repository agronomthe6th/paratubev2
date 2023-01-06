import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import TimeAgo from 'javascript-time-ago';
import Cookie from 'js-cookie';
import axios from 'axios';
import { userSelector, fetchUserBytoken } from '../../store/UserSlice';
import VideoReplyComment from './VideoReplyComment';
import CommentRatingButtons from '../ratingButtons/CommentRatingButtons'

import {EditComments, DeleteComments } from '../../store/commentsSlice';
import {useDispatch, useSelector} from 'react-redux';
import { FetchReplayComments, CreateReplayComments, EditReplayComments, DeleteReplayComments, clearState } from '../../store/CommentsReplaySlice';

import {
  Avatar,
  Button,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
} from '@material-ui/core';
import {
  AddComment,
  ExpandLess,
  ExpandMore,
  MoreVert,
} from '@material-ui/icons';

const VideoComment = (props) => {




    const [showReplies, setShowReplies] = useState(false);
    // const timeAgo = new TimeAgo('en-US');

    const [showForm, setShowForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [showButtons, setShowButtons] = useState(false);
  
    const [anchorEl, setAnchorEl] = useState('')
    const [status, setStatus] = useState('loading');
    const {uid, username, authenticated } = useSelector(userSelector);
    // const { isLogged, user } = useAuthState();
    const dispatch = useDispatch();
    const [replaycomments, setreplaycomments] = useState('');


    // const commentsR = useSelector(state => state.replaycomments);
    // const {isError, isFetching, replaycomments} = commentsR;
    // const [data, setData] = useState('');

    
  useEffect(() => {
    console.log(props);
    refreshReplays();
  }, [dispatch])

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
      // console.log('handleClick');

    };

    const refreshReplays = () => {
      axios.get(`http://localhost:8000/api/reply-comments/?comment=${props.commentId}`)
      .then(resp => {
          setreplaycomments(resp.data);
          console.log(resp.data);
      })
      .catch(err => {
          // Handle Error Here
          console.error(err);
      });
    }

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleEdit = () => {
        if (!authenticated || uid !== props.authorId) return;
    
        let content = prompt() || '';
    
        if (content) content = content.trim();
        else content = '';
    
        if (content && content.length > 0) {
        let data = {
          content: content,
        }
        dispatch(EditComments({commentId: props.commentId, content:content})).then(resp => {
          refreshReplays();
      })
      };
      }

    const handleDelete = async () => {
        if (!authenticated || uid !== props.authorId) return;
    
        let content =
          prompt(
            'Are you sure you want to delete that comment? Type y if you want.'
          ) || '';
    
        if (content) content = content.trim();
        else content = '';
    
        if (content && content === 'y') {
          dispatch(DeleteComments({commentId: props.commentId})).then(resp => {
            refreshReplays();
        })
        }
      }

    const handleReplayCommentCreation = () => {
      // console.log('ReplayCommentCreation', props.commentId);
      dispatch(CreateReplayComments({commentId: props.commentId, content:replyContent})).then(resp => {
        refreshReplays();
    })
    };

    // const test = () => {
    //   console.log(replaycomments);
    // };

    return (
        <>
        {/* <button onClick={test}>test</button> */}
          <ListItem>
            <ListItemAvatar>
              <Avatar src={props.authorAvatar} imgProps={{ loading: 'lazy' }} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography>
                  <Link to={`/profile/${props.authorId}/`}>{props.authorUsername}</Link>{' '}
                  {/* {timeAgo.format(new Date(props.createdAt))} */}
                </Typography>
              }
              secondary={<Typography variant="inherit">{props.content}</Typography>}
            />
            <ListItemSecondaryAction>
            <CommentRatingButtons
                comment={props.commentId}
                likesCount={props.likesCount}
                dislikesCount={props.dislikesCount}
              />
              {/* {status !== 'error' && !error && data && data.pages[0].count > 0 && ( */}
              {replaycomments.count > 0 &&
                <IconButton
                  onClick={() => {
                    setShowReplies(!showReplies);
                    if (showReplies === false) setShowForm(false);
                  }}>
                  {showReplies ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
                }
              {/* )} */}
              <IconButton
                onClick={() => {
                  setShowForm(true);
                }}>
                <AddComment />
              </IconButton>

              {uid === props.authorId && (
                <IconButton onClick={handleClick}>
                  <MoreVert />
                </IconButton>
              )}
            </ListItemSecondaryAction>
          </ListItem>
          {uid === props.authorId && (
            <Menu
              uid="comment-actions-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}>
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleEdit();
                }}>
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleDelete();
                }}>
                Delete
              </MenuItem>
            </Menu>
           )}
          {showForm && (
            <ListItem style={{ marginLeft: '40px' }}>
              {/* <ListItemAvatar>
                <></>
              </ListItemAvatar> */}
              <ListItemText>
                <TextField
                  placeholder="Add a public comment..."
                  fullWidth
                  multiline
                  onFocus={() => {
                    setShowButtons(true);
                  }}
                  value={replyContent}
                  onChange={(e) => {
                    setReplyContent(e.target.value);
                  }}
                />
              </ListItemText>
              {showButtons && (
                <InputAdornment position="end">
                  <Button
                    onClick={() => {
                      setShowButtons(false);
                      setReplyContent('');
                      setShowForm(false);
                    }}>
                    Cancel
                  </Button>
                  <Button variant="outlined" onClick={handleReplayCommentCreation}>
                    Comment
                  </Button>
                </InputAdornment>
              )}
            </ListItem>
          )}
          {showReplies &&
            // (
            // status === 'loading' ? (
            //   <h1>loading...</h1>
            // ) : 
            // status === 'error' ? (
            //   <h1>{error?.message || error}</h1>
            // ) : 
            (
              <>
                {replaycomments && status!='error' &&
                  replaycomments.results.map((item, i) => (
                    <React.Fragment key={i}>
                      <>
                        <VideoReplyComment
                          // commentId={props.commentId}
                          key={item.id}
                          replyId={item.id}
                          content={item.content}
                          likesCount={item.likes_count}
                          dislikesCount={item.dislikes_count}
                          createdAt={item.created_at}
                          authorId={item.author.id}
                          authorUsername={item.author.username}
                          authorAvatar={item.author.avatar}
                        />
                      </>
                    </React.Fragment>
                    )
                  )}
                      
                {/* <button
                  ref={loadMoreVideosButtonRef}
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                  style={{ visibility: 'hidden' }}
                /> */}
              </>
            )
            // )
            }
        </>
      );
}

export default VideoComment
