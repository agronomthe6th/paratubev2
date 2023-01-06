import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookie from 'js-cookie';
import axios from 'axios';
let token = Cookie.get('access_token')

export const FetchComments = createAsyncThunk(
  'comments/FetchComments',
  async ({ videoId }, thunkAPI) => {
    try {
      // console.log(videoId);
      const response = await fetch(
        `http://localhost:8000/api/comments/?video=${videoId}`,
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

export const FetchCommentsNext = createAsyncThunk(
  'comments/FetchCommentsNext',
  async ({ videoId, page }, thunkAPI) => {
    console.log(`Comments next: ${videoId}`);
    try {
      const response = await fetch(
        `http://localhost:8000/api/comments/?page=${page}&video=${videoId}`,
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
      let
       cpage = page
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

export const CreateComments = createAsyncThunk(
  'comments/CreateComments',
  async ({ videoId, content, access_token }, thunkAPI) => {
    try {
      // console.log(videoId, content, Cookie.get('access_token'));
      const response = await fetch(
        `http://localhost:8000/api/comments/`, 
        {
          method: 'POST',
          headers: {
            Authorization: `JWT ${token}`,
            Accept: "application/json",
            
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            video: videoId,
            content: content,
          }),
        }
      );
      // const response = axios
      // .post(`http://localhost:8000/api/comments/`, par ,{
      //   headers: {
      //     Authorization: Cookie.get('access_token')
      //     ? `JWT ${Cookie.get('access_token')}`
      //     : null,
      //     accept: 'application/json',
      //   },
      // })

      let data = await response.json();
      // console.log('data', data);

      if (response.status === 200) {

        // return { ...data};
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log('Error', e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const EditComments = createAsyncThunk(
  'comments/EditComments',
  async ({ commentId, content }, thunkAPI) => {
    try {
      console.log(commentId, content);
      const response = await fetch(
        `http://localhost:8000/api/comments/${commentId}/`, 
        {
          method: 'PATCH',
          headers: {
            Authorization: `JWT ${token}`,
            Accept: "application/json",
            
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            commnet: commentId,
            content: content,
          }),
        }
      );
      // const response = axios
      // .post(`http://localhost:8000/api/comments/`, par ,{
      //   headers: {
      //     Authorization: Cookie.get('access_token')
      //     ? `JWT ${Cookie.get('access_token')}`
      //     : null,
      //     accept: 'application/json',
      //   },
      // })

      let data = await response.json();
      console.log('data', data);

      if (response.status === 200) {
        
        // return { ...data};
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log('Error', e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const DeleteComments = createAsyncThunk(
  'comments/DeleteComments',
  async ({ commentId }, thunkAPI) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/comments/${commentId}/`, 
        {
          method: 'DELETE',
          headers: {
            Authorization: `JWT ${token}`,
            Accept: "application/json",
            
            "Content-Type": "application/json",
          }
        }
      );

      let data = await response.json();

      if (response.status === 200) {
        
        // return { ...data};
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log('Error', e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    author: '',
    page: 1,
    totalpages: 0,
    next: '',
    previous: '',
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
    [FetchComments.fulfilled]: (state, { payload }) => {
      // console.log( Math.ceil(payload.count/8));
      state.page = 1;
      state.next = payload.next;
      state.previous = payload.previous;
      state.comments = payload;
      state.totalpages = Math.ceil(payload.count/8); 
      state.isFetching = false;
      state.isSuccess = true;
    },
    [FetchComments.pending]: (state) => {
      state.isFetching = true;
    },
    [FetchComments.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },

    [FetchCommentsNext.fulfilled]: (state, { payload }) => {
      // console.log('payload', payload, payload.cpage);
      state.page =  payload.cpage;
      state.next = payload.next;
      state.previous = payload.previous;
      state.comments = payload;
      state.totalpages = Math.ceil(payload.count/8); 
      state.isFetching = false;
      state.isSuccess = true;
    },
    [FetchCommentsNext.pending]: (state) => {
      state.isFetching = true;
    },
    [FetchCommentsNext.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },

    [CreateComments.fulfilled]: (state, { payload }) => {
      // console.log('payload', payload);
      // state.video = payload;
      state.isFetching = false;
      state.isFetchingSuccess = true;
    },
    [CreateComments.pending]: (state) => {
      state.isFetching = true;
    },
    [CreateComments.rejected]: (state, { payload }) => {
      state.isFetching  = false;
      state.isCreatingError = true;
      console.log('payload', payload);
      state.errorCreatingMessage = payload.message;
    },


    [EditComments.fulfilled]: (state, { payload }) => {
      console.log('payload', payload);
      // state.video = payload;
      state.isCreating = false;
      state.isCreatingSuccess = true;
    },
    [EditComments.pending]: (state) => {
      state.isCreating = true;
    },
    [EditComments.rejected]: (state, { payload }) => {
      state.isCreating  = false;
      state.isCreatingError = true;
      console.log('payload', payload);
      state.errorCreatingMessage = payload.message;
    },


    [DeleteComments.fulfilled]: (state, { payload }) => {
      console.log('payload', payload);
      // state.video = payload;
      state.isCreating = false;
      state.isCreatingSuccess = true;
    },
    [DeleteComments.pending]: (state) => {
      state.isCreating = true;
    },
    [DeleteComments.rejected]: (state, { payload }) => {
      state.isCreating  = false;
      state.isCreatingError = true;
      console.log('payload', payload);
      state.errorCreatingMessage = payload.message;
    },
  },
});

export const { clearState } = commentsSlice.actions;

export const commentsSelector = (state) => state.comments;
