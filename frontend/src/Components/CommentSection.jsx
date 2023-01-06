import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import {useDispatch, useSelector} from 'react-redux';
import { FetchComments, CreateComments, FetchCommentsNext } from '../store/commentsSlice';

import {
  Avatar,
  Button,
  CircularProgress,
  List,
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
import Pagination from '@mui/material/Pagination';
import Sort from '@material-ui/icons/Sort';
// import useIntersection from 'react-useintersection'

// import { api } from '../../api';
// import { useAuthState } from '../../auth';
import VideoComment from './comments/VideoComment';
import { userSelector } from '../store/UserSlice';

const CommentSection = ({videoId }) => {
  const {uid, authenticated } = useSelector(userSelector);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showButtons, setShowButtons] = useState(false);
  const [content, setContent] = useState('');
  const [data, setData] = useState('');
  const commentsL = useSelector(state => state.comments);
  const {error, loading, comments, next, totalpages, previous, page} = commentsL;

  useEffect(() => {
    dispatch(FetchComments({ videoId: videoId }));
  }, [dispatch])

  const fetchPage = (e, value) => {
    // console.log(value);
    dispatch(FetchCommentsNext({ videoId: videoId, page: value }));
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCommentCreation = () => {
    let access_token =  Cookie.get('access_token');
    dispatch(CreateComments({videoId, content, access_token})).then((response) => {
      dispatch(FetchComments({ videoId: videoId, page:page }));
    })
    .catch((error) => {
        console.log(error);
    })
  };

  // const handleTest = () => {
  //   console.log(totalpages);
  // };

  return (
    
    <>
    {/* <button onClick={handleTest}>Test</button> */}
      <Typography>
        {/* <Button startIcon={<Sort />} onClick={handleTest}>
        handleTest
        </Button> */}
        {data ? data.pages[0].count : 'No'} Comments
        <Button startIcon={<Sort />} onClick={handleClick}>
          Sort by
        </Button>
      </Typography>
      <Menu
        id="sort-by-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        <MenuItem onClick={handleClose}>Top comments</MenuItem>
        <MenuItem onClick={handleClose}>Newest first</MenuItem>
      </Menu>
      <List>
      {authenticated ? 
        <ListItem>
          {/* <ListItemAvatar>
            //currnet user
            <Avatar src={user.avatar} imgProps={{ loading: 'lazy' }} />
          </ListItemAvatar> */}
          <ListItemText>
            <TextField
              placeholder="Add a public comment..."
              fullWidth
              multiline
              onFocus={() => {
                setShowButtons(true);
              }}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          </ListItemText >
          {showButtons && (
            <InputAdornment position="end">
              <>
                <Button
                  onClick={() => {
                    setShowButtons(false);
                    setContent('');
                  }}>
                  Cancel
                </Button>
                <Button 
                variant="outlined"
                onClick={handleCommentCreation}>
                  Comment
                </Button>
              </> 
            


            </InputAdornment>
          )}
        </ListItem>
        : 
        <></>}
        {loading ? 
          <h1><CircularProgress /></h1>
         : error ? 
          <h1>{error?.message || error}</h1>
         : 
         ( <>
            {comments.count > 0 &&
              comments.results.map((item, i) => (
                <React.Fragment key={i}>
                      <VideoComment
                        key={item.id}
                        commentId={item.id}
                        content={item.content}
                        likesCount={item.likes_count}
                        dislikesCount={item.dislikes_count}
                        createdAt={item.created_at}
                        authorId={item.author.id}
                        authorUsername={item.author.username}
                        authorAvatar={item.author.avatar}
                      />
                      </React.Fragment>
                    )
            )}
             {/* <Typography>Page: {page}</Typography> */}
             {totalpages > 1 ?            
              <Pagination count={totalpages} page={page} onChange={fetchPage}/> :
              <></>
             }
          </>
          )
        } 
      </List>
    </>
  );
};

export default CommentSection;
