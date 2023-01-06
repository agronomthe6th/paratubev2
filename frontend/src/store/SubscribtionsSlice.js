import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookie from 'js-cookie';
let token = Cookie.get('access_token')

export const FetchSubs = createAsyncThunk(
  'subscriptions/FetchSubs',
  async ({ channelId, user }, thunkAPI) => {
    try {
      // console.log(channelId, user);
      const response = await fetch(
        `http://localhost:8000/api/subscriptions/?user=${user}`,
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

      if (response.status === 200) {
        // console.log('success', data);
        return { ...data, channelId};
      } else {
        // console.log('rejected', data)
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log('Error', e);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const Sub = createAsyncThunk(
  'subscriptions/Sub',
  async ({ channelId, user }, thunkAPI) => {
    try {
      console.log(channelId, user);
      const response = await fetch(
        `http://localhost:8000/api/subscriptions/`,  
        {
          method: 'POST',
          headers: {
            Authorization: `JWT ${token}`,
            Accept: "application/json",
            
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            channel_id: channelId.channel,
            user: user,
          }),
        }
      );
      let data = await response.json();
      if (response.status === 201) {
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log('Error', e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const UnSub = createAsyncThunk(
  'subscriptions/UnSub',
  async ({ subId }, thunkAPI) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/subscriptions/${subId}/`, 
        {
          method: 'DELETE',
          headers: {
            Authorization: `JWT ${token}`,
            Accept: "application/json",
            
            "Content-Type": "application/json",
          }
        }
      );

      // let data = await response.json();
      let data = '';
      if (response.status === 204) {
        console.log('deleteed');
        return { ...data};
      } else {
        return thunkAPI.rejectWithValue('');
      }
    } catch (e) {
      console.log('Error', e);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const SubscribtionsSlice = createSlice({
  name: 'subscriptions',
  initialState: {
    subId: '',
    isSubscribed: false,
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
    [FetchSubs.fulfilled]: (state, { payload }) => {

      // console.log(payload);
      for (var key in payload) {
          if (payload.hasOwnProperty(key)) {
            if(payload[key].channel.id === payload.channelId.channel) {
              // console.log('key', payload[key]);
              state.isSubscribed = true;
              state.subId = payload[key].id;
              break;
            } 
          }
        }
      state.isFetching = false;
      state.isSuccess = true;
    },
    [FetchSubs.pending]: (state) => {
      state.isFetching = true;
    },
    [FetchSubs.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload;
    },


    [Sub.fulfilled]: (state, { payload }) => {
      state.isSubscribed = true;  
      state.isFetching = false;
      state.isSuccess = true;
      state.isSubscribed = true;
    },
    [Sub.pending]: (state) => {
      state.isFetching = true;
    },
    [Sub.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload;
    },


    [UnSub.fulfilled]: (state, { payload }) => {
      state.isSubscribed = false;
      state.isFetching = false;
      state.isSuccess = true;
      state.isSubscribed = false;
    },
    [UnSub.pending]: (state) => {
      state.isFetching = true;
    },
    [UnSub.rejected]: (state, { payload }) => {
      console.log(`Rejected ${payload}`);
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload;
    },
  },
});

export const { clearState } = SubscribtionsSlice.actions;

export const subscriptionSelector = (state) => state.subscribtions;
