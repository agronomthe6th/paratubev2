import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import {Row, Col, Card, Container} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PlaceholderLoading from 'react-placeholder-loading'
import ReactPlayer from 'react-player';
import Cookie from 'js-cookie';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import VideoRatingButtons from '../Components/ratingButtons/VideoRatingButtons';
import VideoWatchItemCard from '../Components/video/VideoWatchItemCard';
import { Link as RRLink, useHistory, useParams } from 'react-router-dom';
import { videoSelector, FetchVideo } from '../store/VideoSlice';
import VideoPlayerApp from '../Components/video/VideoPlayerApp';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import FlagIcon from '@mui/icons-material/Flag';
import AddToPlaylistButton from '../Components/video/AddToPlaylistButton';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import {
  Avatar,
  Box,
  Button,
  createStyles,
  Divider,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Snackbar,
  SnackbarCloseReason,
  Theme,
  Typography,
} from '@material-ui/core';
import {
  VKShareButton
} from "react-share";
import { MoreHoriz, NotificationsNone, Share } from '@material-ui/icons';
import CommentSection from '../Components/CommentSection';
import Playlist from '../Components/video/Playlist';
import SubscribeButton from '../Components/video/SubscribeButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { userSelector } from '../store/UserSlice';

function Video() {
  const { username, authenticated } = useSelector(userSelector);
  const { id } = useParams()
  const dispatch = useDispatch();
  // const { video, author } = useSelector(videoSelector);
  const uservideos = useSelector(state => state.video);
  const {video, author, isFetching, isError, isSuccess} = uservideos;
  const [anchor, setAnchor] = React.useState(null);

  useEffect(() => {
    dispatch(FetchVideo({ videoId: id }));
  }, [])

  // const test = () => {
  //   console.log(video);
  //   console.log(author);
  //   console.log(isSuccess);
  //   console.log(author);
  // };

  const handleOpenOptionsMenu = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleCloseOptionsMenu = () => {
    setAnchor(null);
  }

  return (
    <>
     {/* <Button onClick={test}>test</Button> */}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        // open={isSnackbarOpen}
        autoHideDuration={2500}
        // onClose={closeSnackbar}
        message="Link copied to clipboard"
      />
      <Grid container  sx={{m:0}}>
        <Grid item lg={9} md={12} sm={12} >
          <Box sx={{p:3, pt:0}}>
            { isFetching ? (
                <Row className="d-flex justify-content-center m-4">
                  <Col className="col-sm-10 col-md-8 col-lg-6">
                      <Card className="p-3">
                        <PlaceholderLoading shape="rect" width={'100%'} height={'100%'}/>
                      </Card>
                  </Col>
                </Row>
            ) : isError ? (
              <h1>isError</h1>
            ) : (
              isSuccess && ( 
                <>
                <div className='playerWrapper' >
                  <VideoPlayerApp video={video}/> 
                </div>
            <List >
              <ListItem className='p-0'>
                <ListItemText
                  primary={video.title}
                  secondary={`${video.views_count} views • ${new Date(
                    video.created_at
                  ).toLocaleDateString()}`}
                />
                
                <ListItemSecondaryAction className='p-0' style={{
                    right: 0,
                    width: "fit-content",
                    margin: "auto",
                }}>
                  <VideoRatingButtons
                    video={video.id}
                    likesCount={video.likes_count}
                    dislikesCount={video.dislikes_count}
                  />
                  
                  <Popup trigger={<Button  startIcon={<Share />}>Share</Button>}>
                    <span >{window.location.href}</span>
                  </Popup>

                  <AddToPlaylistButton videoId={video.id} />
                  <IconButton onClick={handleOpenOptionsMenu}>
                    <MoreHoriz />
                  </IconButton>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchor}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchor)}
                    onClose={handleCloseOptionsMenu}
                  >
                      <MenuItem key='report' onClick={handleCloseOptionsMenu}>
                        <Typography 
                        // textAlign="center"
                        ><FlagIcon/> report </Typography>
                      </MenuItem>
                  </Menu>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem className='p-0'>
                <ListItemAvatar>
                  <Avatar
                    src={author.avatar}
                    style={{ width: '48px', height: '48px' }}
                    imgProps={{ loading: 'lazy' }}
                  />
                </ListItemAvatar>
                <ListItemText
                      primary={
                        <Link
                          component={RRLink}
                          to={`/users/${author.id}`}
                          color="inherit">
                          {author.username}
                        </Link>
                      }
                      // secondary={`${author.subscribers_count} subscribers`}
                    />
                { authenticated ? 
                <ListItemSecondaryAction>
                  <SubscribeButton channel={author.id} />
                  {/* <IconButton>
                    <NotificationsNone />
                  </IconButton> */}
                </ListItemSecondaryAction>
                : <></>}
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <>
                  {/* {author.avatar} */}
                  </>
                </ListItemAvatar>
                <ListItemText>
                  <Typography>
                    <ReactMarkdown plugins={[remarkGfm]}>
                      {video.description}
                    </ReactMarkdown>
                  </Typography>
                </ListItemText>
              </ListItem>
            </List>
            <Divider />
            <CommentSection videoId={id} />
            </>
            ))}
          </Box>
        </Grid>
        <Grid item lg={3} md={12} sm={12} sx={{ml:0}}>
          <Playlist videoId={video.id} />
        </Grid>
      </Grid>
  </>
  );
}

export default Video
