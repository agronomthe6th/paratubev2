import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from './UserSlice';
import commentReducer from '../reducers/commentReducers'
import { videoSlice } from './VideoSlice';
import { commentsSlice } from './commentsSlice';
import { CommentsReplaySlice } from './CommentsReplaySlice';
import { VideoRatingSlice } from './VideoRatingsSlice';
import { SubscribtionsSlice } from './SubscribtionsSlice';

export default configureStore({
  reducer: {
    user: userSlice.reducer,
    video: videoSlice.reducer,
    comments: commentsSlice.reducer,
    replaycomments: CommentsReplaySlice.reducer,
    videorating: VideoRatingSlice.reducer,
    subscribtions: SubscribtionsSlice.reducer,
    // comments: commentReducer,
  },
});
