import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const baseURL = 'https://anandconnect.in/';

export const create_user = createAsyncThunk(
  'user/create_user',
  async (data, {rejectWithValue}) => {
    try {
      const response = await axios.post(
        `${baseURL}/create/create_user.php`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const get_user = createAsyncThunk(
  'user/get_user',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axios.get(`${baseURL}/create/get_user.php`);
      return response.data.users;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const update_user = createAsyncThunk(
  'user/update_user',
  async (data, {rejectWithValue}) => {
    try {
      const response = await axios.post(`${baseURL}/update/update.php`, data, {
        headers: {'Content-Type': 'multipart/form-data'},
      });       
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);
export const delete_user = createAsyncThunk('user/delete_user', async id => {
  const formData = new FormData();
  formData.append('id', id);
  try {
    const response = await axios.post(
      `${baseURL}/delete/delete_user.php`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log('error');
    return console.log(error.message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // Create User
      .addCase(create_user.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(create_user.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(create_user.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create user';
      })
      // Get User
      .addCase(get_user.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(get_user.fulfilled, (state, action) => {
        state.isLoading = false;

        state.user = action.payload;
      })
      .addCase(get_user.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch user';
      })

      // Update User
      .addCase(update_user.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(update_user.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(update_user.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update user';
      })

      //delete user
      .addCase(delete_user.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(delete_user.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(delete_user.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete user';
      });
  },
});

export default userSlice.reducer;
