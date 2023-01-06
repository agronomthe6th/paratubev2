import React, { Component } from 'react';
// import VideoPlayer from 'react-video-js-player';
import { useEffect, useState } from 'react';
// import ReactPlayer from 'react-player'
import ReactPlayer from 'react-player/lazy'
const VideoPlayerApp = (props) => {
    
    useEffect(() => {
        console.log(props.video);
      }, [])

    return (
        <> 
       <ReactPlayer controls="true" width="100%" height="100%" url={props.video.video} />
        </>
    );
}
export default VideoPlayerApp;