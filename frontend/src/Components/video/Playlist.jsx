import React from 'react';
import { Link as RRLink } from 'react-router-dom';
import TimeAgo from 'javascript-time-ago';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  createStyles,
  Link,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import VideoWatchItemCard3 from './VideoWatchItemCard3';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      margin: theme.spacing(1),
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
    },
    cover: {
      width: '16rem',
    },
    channelName: {
      lineHeight: '24px',
      marginLeft: theme.spacing(1),
    },
    ml: {
      marginLeft: theme.spacing(2),
    },
  })
);


function Playlist(videoId) {
  const [playlist, setPlaylist] = useState([]);

    useEffect(() => {

    axios
    .get(`http://localhost:8000/api/videos/`, {
      headers: {
        Authorization: Cookie.get('access_key')
        ? `JWT ${Cookie.get('access_key')}`
        : null,
        accept: 'application/json',
      },
    })
    .then((response) => {
        // console.log(response.data.results)
        setPlaylist(response.data.results) 
    })
    .catch((error) => {
        // console.log(error);
    })

        // console.log(videoId)    
    }, [])
    

  return (
    <>
      {playlist.map(item => (
          <VideoWatchItemCard3  key={item.id} video={item} />
      ))}
    </>
  )
}

export default Playlist
