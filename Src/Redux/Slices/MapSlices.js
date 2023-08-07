import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import MapServices from '../../Services/MapServices';
const initialState = {
  mapMarker: [],
  initailCordinates: {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
};

const mapSlice = createSlice({
  name: 'maps',
  initialState,
  reducers: {
    setMapMarkers: (state, actions) => {},
  },
  extraReducers: builder => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchMapMarkers.fulfilled, (state, action) => {
      state.mapMarker = action.payload.results;
      state.initailCordinates = {
        latitude:action.payload.results[0].lat,
        longitude:action.payload.results[0].lon,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
      // Add user to the state array
      // state.entities.push(action.payload)
    });
  },
});

export const fetchMapMarkers = createAsyncThunk(
  'maps/fetchMapMarkers',
  async (userId, thunkAPI) => {
    const response = await MapServices.getMapMarkers();
    return response;
  },
);

export const {setMapMarkers} = mapSlice.actions;

export default mapSlice.reducer;

