import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookie from 'js-cookie';

let token = Cookie.get('access_token')



export const FetchVideo = createAsyncThunk(
  'videos/FetchVideo',
  async ({ videoId }, thunkAPI) => {
    try {
      // console.log(token);
      const response = await fetch(
        `http://localhost:8000/api/videos/${videoId}/`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            // Authorization: `JWT ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      let data = await response.json();
      // console.log('data', data);

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

export const FetchAllVideos = createAsyncThunk(
  'videos/FetchAllVideos',
  async ({ page },thunkAPI) => {
    console.log('Fetching all videos, page ', page);
    try {
      const response = await fetch(
        `http://localhost:8000/api/videos/?page=${page}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            // Authorization: `JWT ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      let data = await response.json();
      let cpage = page
      if (response.status === 200) {
        return { ...data, cpage};
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log('Error', e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const SearchVideos = createAsyncThunk(
  'videos/SearchVideos',
  async ({ searchQuery, page },thunkAPI) => {
    console.log('Searching videos...', searchQuery);
    try {
      const response = await fetch(
        `http://localhost:8000/api/videos/?page=${page}&search=${searchQuery}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            // Authorization: `JWT ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      let data = await response.json();
      let cpage = page
      if (response.status === 200) {
        return { ...data, cpage};
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log('Error', e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);


export const FetchVideosByUser = createAsyncThunk(
  'videos/FetchVideosByUser',
  async ({ userId }, thunkAPI) => {
    try {
      // console.log(userId);
      const response = await fetch(
        `http://localhost:8000/api/?author=${userId}`,
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

export const RefreshRatings = createAsyncThunk(
  'videos/RefreshRatings',
  async ({ videoId }, thunkAPI) => {
    console.log('RefreshRatings', videoId);
    try {
      // console.log(token);
      const response = await fetch(
        `http://localhost:8000/api/video-ratings/?video=${videoId}`,
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
      console.log(data);
      if (response.status === 200) {
        console.log(response);
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

export const getratings = createAsyncThunk(
  'videos/getratings',
  async ({ uid, videoId }, thunkAPI) => {
    console.log('getratings', uid, videoId);
    try {
      // console.log(token);
      const response = await fetch(
        `http://localhost:8000/api/video-ratings/?user=${uid}&video=${videoId}`,
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
      console.log(data);
      if (response.status === 200) {
        console.log(response);
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


export const videoSlice = createSlice({
  name: 'video',
  initialState: {
    video: [],
    videos: [],
    author: [],
    isLiking: false,
    isDisLiking: false,
    isFetching: false,
    isSuccess: false,
    isError: false,
    next: '',
    previous: '',
    page: 1,
    totalpages: 0,
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
    [FetchVideo.fulfilled]: (state, { payload }) => {
      // console.log('isSuccess ', payload);
      state.video = payload;
      state.author = payload.author;
      state.isFetching = false;
      state.isSuccess = true;
    },
    [FetchVideo.pending]: (state) => {
      state.isFetching = true;
    },
    [FetchVideo.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },



    [FetchAllVideos.fulfilled]: (state, { payload }) => {
      console.log('payload', payload);
      state.page =  payload.cpage;
      state.videos = payload;
      state.author = payload.author;
      state.isFetching = false;
      state.isSuccess = true;
      state.totalpages = Math.ceil(payload.count/12); 
      if(payload.next) {
        state.next = payload.next;
      }
      if(payload.previous) {
        state.previous = payload.previous;
      }
    },
    [FetchAllVideos.pending]: (state) => {
      state.isFetching = true;
    },
    [FetchAllVideos.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },




    [SearchVideos.fulfilled]: (state, { payload }) => {
      console.log('payload', payload);
      state.page =  payload.cpage;
      state.totalpages = Math.ceil(payload.count/12); 
      if(payload.next) {
        state.next = payload.next;
      }
      if(payload.previous) {
        state.previous = payload.previous;
      }
      state.videos = payload;
      state.author = payload.author;
      state.isFetching = false;
      state.isSuccess = true;
    },
    [SearchVideos.pending]: (state) => {
      state.isFetching = true;
    },
    [SearchVideos.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },

    
    [RefreshRatings.fulfilled]: (state, { payload }) => {
      console.log('RefreshRatings succ', payload.results[0].likes_count);
      console.log('RefreshRatings succ', payload.results[0].dislikes_count);
      // state.isLiking = true;
      // state.isDisLiking = false;
    },

    [FetchVideosByUser.fulfilled]: (state, { payload }) => {
      // console.log('payload', payload);
      state.videos = payload;
      state.author = payload.author;
      state.isFetching = false;
      state.isSuccess = true;
    },
    [FetchVideosByUser.pending]: (state) => {
      state.isFetching = true;
    },
    [FetchVideosByUser.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },

  

    [getratings.fulfilled]: (state, { payload }) => {
      console.log(payload);
      // console.log(payload.results[0]);
      if (payload.results[0].is_liking == true) {
        state.isLiking = true;
      } else if (payload.results[0].is_disliking == true) {
        state.isDisLiking = true;
      }
    },
  },
});

export const { clearState } = videoSlice.actions;

export const videoSelector = (state) => state.video;
