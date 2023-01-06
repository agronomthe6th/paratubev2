import React, { Component } from 'react';
import VideoPlayer from 'react-video-js-player';
import VideoJS from './VideoJS'

const VideoPlayerApp = (props) => {
    const playerRef = React.useRef(null);

    const videoJsOptions = {
    //   autoplay: true,
      controls: true,
      responsive: true,
      muted: true,
    //   fluid: true,
      sources: [{
        src: props.video.video,
    // type: 'video/mp4'
        type: 'application/dash+xml'
      }]
    }

    const handlePlayerReady = (player) => {
        playerRef.current = player;
    
        // You can handle player events here, for example:
        player.on('waiting', () => {
        //   videojs.log('player is waiting');
        });
    
        player.on('dispose', () => {
        //   videojs.log('player will dispose');
        });
      }

    return (
        <> 
            <VideoJS className="" options={videoJsOptions} onReady={handlePlayerReady} />
        </>
    );
}
export default VideoPlayerApp;