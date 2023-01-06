import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TimeAgo from 'javascript-time-ago';
import Cookie from 'js-cookie';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { userSelector, fetchUserBytoken } from '../../store/UserSlice';
import { FetchReplayComments, CreateReplayComments, EditReplayComments, DeleteReplayComments } from '../../store/CommentsReplaySlice';

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
import CommentReplayRatingButtons from '../ratingButtons/CommentReplayRatingButtons';

const VideoReplyComment = (props) => {

    const dispatch = useDispatch();


    const {id, username, authenticated } = useSelector(userSelector);

    const [showReplies, setShowReplies] = useState(false);
    // const timeAgo = new TimeAgo('en-US');
    const [showForm, setShowForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
  
    const [showButtons, setShowButtons] = useState(false);
  
    const [anchorEl, setAnchorEl] = useState(null);
  
    // const { isLogged, user } = useAuthState();
  
    const [data, setData] = useState('');


  useEffect(() => {
    console.log('opened replay comments ', props)
    // dispatch(FetchReplayComments({commentId: props.commentId}))
  }, [])

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleEdit = () => {
      if (!authenticated || id !== props.authorId) return;
  
      let content = prompt() || '';
  
      if (content) content = content.trim();
      else content = '';
  
      if (content && content.length > 0) {
      let data = {
        content: content,
      }
        dispatch(EditReplayComments({replayId: props.replayId, content: content}));
    };
    }

  const handleDelete = async () => {
      if (!authenticated || id !== props.replyId) return;
  
      let content =
        prompt(
          'Are you sure you want to delete that comment? Type y if you want.'
        ) || '';
  
      if (content) content = content.trim();
      else content = '';
  
      if (content && content === 'y') {
        dispatch(DeleteReplayComments({replayId: props.replayId}));
      };
    }

    return (
        <ListItem style={{ marginLeft: '40px' }}>
        <ListItemAvatar>
          <Avatar src={props.authorAvatar} imgProps={{ loading: 'lazy' }} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography>
              <Link to={`/channel/${props.authorId}/`}>{props.authorUsername}</Link>{' '}
              {/* {timeAgo.format(new Date(props.screatedAt))} */}
            </Typography>
          }
          secondary={<Typography variant="inherit">{props.content}</Typography>}
        />
        <ListItemSecondaryAction>
          <CommentReplayRatingButtons
            replyComment={props.replyId}
            likesCount={props.likesCount}
            dislikesCount={props.dislikesCount}
          />
          {id === props.authorId && (
            <>
              <IconButton onClick={handleClick}>
                <MoreVert />
              </IconButton>
              <Menu
                id="comment-actions-menu"
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
            </>
          )}
        </ListItemSecondaryAction>
      </ListItem>
      );
}

export default VideoReplyComment;

