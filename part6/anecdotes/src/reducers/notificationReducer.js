import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: null,
    reducers: {

        setNotification (state, {payload}) {

            return payload;
        }
    }
});

export default notificationSlice.reducer;