import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookie from 'js-cookie';
let token = Cookie.get('access_token')

export const FetchReplayComments = createAsyncThunk(
  'replaycomments/FetchReplayComments',
  async ({ commentId }, thunkAPI) => {
    try {
      // console.log(commentId);
      
      const response = await fetch(
        `http://localhost:8000/api/reply-comments/?comment=${commentId}`,
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

export const FetchReplayCommentsById = createAsyncThunk(
  'replaycomments/FetchReplayComments',
  async ({ commentId }, thunkAPI) => {
    try {
      console.log(commentId);
      
      const response = await fetch(
        `http://localhost:8000/api/reply-comments/?comment=${commentId}`,
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


export const CreateReplayComments = createAsyncThunk(
  'replaycomments/CreateReplayComments',
  async ({ commentId, content }, thunkAPI) => {
    try {
      console.log(`CreateReplayComments: ${commentId}`);
      // console.log(videoId, content, Cookie.get('access_token'));
      const response = await fetch(
        `http://localhost:8000/api/reply-comments/`,
        {
          method: 'POST',
          headers: {
            Authorization: `JWT ${token}`,
            Accept: "application/json",
            
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: commentId,
            content: content,
          }),
        }
      );

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

export const EditReplayComments = createAsyncThunk(
  'replaycomments/EditReplayComments',
  async ({ replyId, content }, thunkAPI) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/reply-comments/${replyId}/`, 
        {
          method: 'PATCH',
          headers: {
            Authorization: `JWT ${token}`,
            Accept: "application/json",
            
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: content,
          }),
        }
      );

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

export const DeleteReplayComments = createAsyncThunk(
  'replaycomments/DeleteReplayComments',
  async ({ replyId }, thunkAPI) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/reply-comments/${replyId}/`, 
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

export const CommentsReplaySlice = createSlice({
  name: 'replaycomments',
  initialState: {
    replaycomments: [],
    author: '',
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
    [FetchReplayComments.fulfilled]: (state, { payload }) => {
      // console.log('replaycomments', payload);
      state.replaycomments = []; //ass
      state.replaycomments = payload;
      state.isFetching = false;
      state.isSuccess = true;
    },
    [FetchReplayComments.pending]: (state) => {
      state.isFetching = true;
    },
    [FetchReplayComments.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },


    [CreateReplayComments.fulfilled]: (state, { payload }) => {
      // console.log('payload', payload);
      // state.video = payload;
      state.isFetching = false;
      state.isFetchingSuccess = true;
    },
    [CreateReplayComments.pending]: (state) => {
      state.isFetching = true;
    },
    [CreateReplayComments.rejected]: (state, { payload }) => {
      state.isFetching  = false;
      state.isCreatingError = true;
      // console.log('payload', payload);
      state.errorCreatingMessage = payload.message;
    },


    [EditReplayComments.fulfilled]: (state, { payload }) => {
      // console.log('payload', payload);
      // state.video = payload;
      state.isCreating = false;
      state.isCreatingSuccess = true;
    },
    [EditReplayComments.pending]: (state) => {
      state.isCreating = true;
    },
    [EditReplayComments.rejected]: (state, { payload }) => {
      state.isCreating  = false;
      state.isCreatingError = true;
      console.log('payload', payload);
      state.errorCreatingMessage = payload.message;
    },


    [DeleteReplayComments.fulfilled]: (state, { payload }) => {
      console.log('payload', payload);
      // state.video = payload;
      state.isCreating = false;
      state.isCreatingSuccess = true;
    },
    [DeleteReplayComments.pending]: (state) => {
      state.isCreating = true;
    },
    [DeleteReplayComments.rejected]: (state, { payload }) => {
      state.isCreating  = false;
      state.isCreatingError = true;
      // console.log('payload', payload);
      state.errorCreatingMessage = payload.message;
    },
  },
});

export const { clearState } = CommentsReplaySlice.actions;

export const ReplayCommentsSelector = (state) => state.replaycomments;
