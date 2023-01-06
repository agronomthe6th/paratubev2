import React from 'react'
import videojs from "video.js";

const VideoPage = ({ video }) => {
  const options = {
    controls: true,
    poster: video.poster,
    sources: [{ src: video.url }]
  }
  return (
    <VideoPlayer options={options} key={video.id} />
  )
}

export default VideoPage