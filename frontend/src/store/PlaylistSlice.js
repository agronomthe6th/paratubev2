import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookie from 'js-cookie';

let token = Cookie.get('access_token')

export const FetchPlaylistbyId = createAsyncThunk(
  'playlist/FetchPlaylistbyId',
  async ({ videoId, uid }, thunkAPI) => {
    let link ='';
    link = `http://localhost:8000/api/video-ratings/?user=${uid}&video=${videoId}`
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
  } 
);


export const PlaylistSlice = createSlice({
  name: 'playlist',
  initialState: {
    playlist_id: '',
    playlist_videos: [],
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
    [FetchPlaylistbyId.fulfilled]: (state, { payload }) => {
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

  },
});

export const { clearState } = PlaylistSlice.actions;

export const videoSelector = (state) => state.playlist;
