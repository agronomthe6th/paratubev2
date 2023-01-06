import React, { Component, useEffect } from 'react';
import VideoPlayer from 'react-video-js-player';

const VideoPlayerApp = (props) => {
    
    useEffect(() => {
        console.log(props.video);
      }, [])

    return (
        <> 
            <VideoPlayer 
                className="vjs-fill"
                src={props.video.video}
                type="application/dash+xml"
                controls
                fluid="true"
                muted="true" 
                width="100%"
                height="100%"
            />
        </>
    );
}
export default VideoPlayerApp;