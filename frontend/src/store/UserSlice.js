import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookie from 'js-cookie';

let token = Cookie.get('access_token')

export const signupUser = createAsyncThunk(
  'users/signupUser',
  async ({ username, email, password, password2 }, thunkAPI) => {
    try {
      console.log(username);
      console.log(email);
      console.log(password);
      const response = await fetch(
        'http://localhost:8000/api/register/',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email,
            password,
            password2,
          }),
        }
      );
      let data = await response.json();
      console.log('data', data);

      if (response.status === 200) {
        console.log('here');
        // localStorage.setItem('token', data.token);
        return { ...data, username: username, email: email };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log('Error', e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  'users/login',
  async ({ username, password }, thunkAPI) => {
    try {
      // console.log('Login', username, password);
      const response = await fetch(
        'http://localhost:8000/api/token',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );
      let data = await response.json();
      console.log('response', data);

      if (response.status === 200) {
        Cookie.set('access_token', data.access);
        // localStorage.setItem('access_token', data.token);
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log('Error', e.response.data);
      thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const fetchUserBytoken = createAsyncThunk(
  'users/fetchUserByToken',
  async ({}, thunkAPI) => {
    // console.log(JSON.parse(atob(Cookie.get('access_token').split('.')[1])).user_id);
    try {
      let u_id = JSON.parse(atob(Cookie.get('access_token').split('.')[1])).user_id;
      // console.log(u_id);
      const response = await fetch(
        `http://localhost:8000/api/users/${u_id}/`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      let data = await response.json();
      // console.log('data', data, response.status);

      if (response.status === 200) {
        // console.log(data); 
        return { ...data };
      } else {
        // console.log('data', data);
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log('Error', e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    uid: '',
    username: '',
    email: '',
    description: '',
    avatar: '',
    authenticated: false,
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
    [signupUser.fulfilled]: (state, { payload }) => {
      // console.log('payload', payload);
      state.isFetching = false;
      state.isSuccess = true;
      state.email = payload.user.email;
      state.username = payload.user.username;
      state.uid = payload.user.id;
    },
    [signupUser.pending]: (state) => {
      state.isFetching = true;
    },
    [signupUser.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      state.authenticated = true;
      state.uid = payload.id;
      state.email = payload.email;
      state.username = payload.username;
      state.isFetching = false;
      state.isSuccess = true;
      // console.log(state.authenticated);
      return state;
    },
    [loginUser.rejected]: (state, { payload }) => {
      // console.log('payload', payload);
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
    [loginUser.pending]: (state) => {
      state.isFetching = true;
    },
    [fetchUserBytoken.pending]: (state) => {
      state.isFetching = true;
    },
    [fetchUserBytoken.fulfilled]: (state, { payload }) => {
      // console.log(payload);
      state.description = payload.description;
      state.uid = payload.id;
      state.email = payload.email;
      state.username = payload.username;
      state.authenticated = true;
      state.isFetching = false;
      state.isSuccess = true;
      state.avatar = payload.avatar;
      state.uid = payload.id;
      state.email = payload.email;
      state.username = payload.username;
    },
    [fetchUserBytoken.rejected]: (state) => {
      // console.log(state);
      state.isFetching = false;
      state.isError = true;
    },
  },
});

export const { clearState } = userSlice.actions;

export const userSelector = (state) => state.user;
