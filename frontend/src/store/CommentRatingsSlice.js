import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookie from 'js-cookie';

let token = Cookie.get('access_token')

export const FetchVideoRating = createAsyncThunk(
  'videorating/FetchVideoRating',
  async ({ videoId, uid }, thunkAPI) => {
    try {
      let link ='';
      if (uid) {
        link = `http://localhost:8000/api/video-ratings/?user=${uid}&video=${videoId}`
        console.log('user already exitst');
      } else {
        link = `http://localhost:8000/api/video-ratings/?video=${videoId}`
        console.log('anonymous user'); 
      }
      
      const response = await fetch(
        link,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `JWT ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      let data = await response.json();
      console.log('data', data);

      if (response.status === 200) {
        return { ...data};
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log('Error', e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);


export const like = createAsyncThunk(
  'videorating/like',
  async ({ uid, videoId }, thunkAPI) => {
    console.log('like', uid, videoId);
    try {
      // console.log(token);
      const response = await fetch(
        `http://localhost:8000/api/video-ratings/`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `JWT ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            video: videoId,
            user: uid,
            is_liking: true,
            is_disliking: false,
          }),
        }
      );
      let data = await response.json();
      console.log(response);
      if (response.status === 201) {
        console.log('status code 200');
        return { ...data};
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log('Error', e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
); 

export const dislike = createAsyncThunk(
  'videorating/dislike',
  async ({ uid, videoId }, thunkAPI) => {
    try {
      console.log('send dislike');
      const response = await fetch(
        `http://localhost:8000/api/video-ratings/`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `JWT ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            video: videoId,
            user: uid,
            is_liking: false,
            is_disliking: true,
          }),
        }
      );
      let data = await response.json();
      if (response.status === 201) {
        return { ...data};
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log('Error', e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
); 

export const unlike = createAsyncThunk(
  'videorating/unlike',
  async ({ uid, videoId }, thunkAPI) => {
    try {
      console.log('unlike', uid, videoId);
      const response = await fetch(
        `http://localhost:8000/api/video-ratings/`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `JWT ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            video: videoId,
            user: uid,
            is_liking: false,
            is_disliking: false,
          }),
        }
      );
      let data = await response.json();
      if (response.status === 201) {
        return { ...data};
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log('Error', e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
); 

export const undislike = createAsyncThunk(
  'videorating/undislike',
  async ({ uid, videoId }, thunkAPI) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/video-ratings/`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `JWT ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            video: videoId,
            user: uid,
            is_liking: false,
            is_disliking: false,
          }),
        }
      );
      let data = await response.json();
      if (response.status === 201) {
        return { ...data};
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log('Error', e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
); 

export const VideoRatingSlice = createSlice({
  name: 'videorating',
  initialState: {
    likesCount: 0,
    dislikesCount: 0,
    isLiking: false,
    isDisLiking: false,
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
  },
  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;
      return state;
    },
  },

  extraReducers: {
    [FetchVideoRating.fulfilled]: (state, { payload }) => {
      try {
        console.log('RefreshRatings succ', payload.results[0]);
        state.likesCount = payload.results[0].likes_count;
        state.dislikesCount = payload.results[0].dislikes_count;
        state.isLiking = payload.results[0].is_liking;
        state.isDisLiking = payload.results[0].is_disliking;
      } catch (e) {
        console.log('RefreshRatings error', payload.results[0]);
      }
      state.isSuccess = true;
    },

    [like.fulfilled]: (state, { payload }) => {
      console.log(payload);
      state.isLiking = true;
      state.isDisLiking = false;
      state.likesCount = payload.likes_count;
      state.dislikesCount = payload.dislikes_count;
    },

    [dislike.fulfilled]: (state, { payload }) => {
      console.log('fulfilled', payload);
      state.isDisLiking = true;
      state.isLiking = false;
      state.likesCount = payload.likes_count;
      state.dislikesCount = payload.dislikes_count;
    },

    [unlike.fulfilled]: (state, { payload }) => {
      state.isLiking = false;
      state.likesCount = payload.likes_count;
      state.dislikesCount = payload.dislikes_count;
    },

    [undislike.fulfilled]: (state, { payload }) => {
      state.isDisLiking = false;
      state.likesCount = payload.likes_count;
      state.dislikesCount = payload.dislikes_count;
    },
  },
});

export const { clearState } = VideoRatingSlice.actions;

export const videoSelector = (state) => state.videorating;
