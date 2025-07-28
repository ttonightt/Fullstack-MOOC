import { createSlice, current } from "@reduxjs/toolkit";

const filterSlice = createSlice({
    name: "filter",
    initialState: "",
    reducers: {
        
        setFilter (state, {payload}) {

            return payload;
        }
    }
});

export default filterSlice.reducer;