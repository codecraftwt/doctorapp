import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {baseurl} from '../utlis/API';

export const login = createAsyncThunk(
  'auth/login',
  async ({username, password}) => {
    console.log(username, password, '#######');
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post(`${baseurl}User/login.php`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data, '###response####');

      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Check your connection';
      });
  },
});

export default authSlice.reducer;
