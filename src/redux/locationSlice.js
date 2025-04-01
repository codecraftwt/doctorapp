import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const baseURL = 'https://anandconnect.in/';

const initialState = {
  states: [],
  districts: [],
  talukas: [],
  villages: [],
  stateLoading: false,
  error: null,
};

export const fetchStates = createAsyncThunk(
  'locations/fetchStates',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axios.get(`${baseURL}/get_state/get_state.php`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  },
);

export const fetchDistrictById = createAsyncThunk(
  'locations/fetchDistrictById',
  async (state_id, {rejectWithValue}) => {
    try {
      const response = await axios.get(
        `${baseURL}/get_district/get_district.php?state_id=${state_id}`,
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  },
);

export const fetchTalukaById = createAsyncThunk(
  'locations/fetchTalukaById',
  async (district_id, {rejectWithValue}) => {
    try {
      const response = await axios.get(
        `${baseURL}/get_talukas/get_talukas.php?district_id=${district_id}`,
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  },
);

export const fetchVillageById = createAsyncThunk(
  'locations/fetchVillageById',
  async (taluka_id, {rejectWithValue}) => {
    try {
      const response = await axios.get(
        `${baseURL}/get_villages/get_villages.php?taluka_id=${taluka_id}`,
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  },
);

// Slice
const locationSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchStates.pending, state => {
        state.stateLoading = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.states = action.payload;
        state.stateLoading = false;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.stateLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchDistrictById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistrictById.fulfilled, (state, action) => {
        state.districts = action.payload;
        state.loading = false;
      })
      .addCase(fetchDistrictById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTalukaById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTalukaById.fulfilled, (state, action) => {
        state.talukas = action.payload;
        state.loading = false;
      })
      .addCase(fetchTalukaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchVillageById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVillageById.fulfilled, (state, action) => {
        state.villages = action.payload;
        state.loading = false;
      })
      .addCase(fetchVillageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default locationSlice.reducer;
