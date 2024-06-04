
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Item {
    id: string;
    title: string;
    category: string;
}

const initialState: Item[] = [];

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<Item>) => {
            state.push(action.payload);
        },
        editItem: (state, action: PayloadAction<Item>) => {
            const index = state.findIndex((item) => item.id === action.payload.id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        deleteItem: (state, action: PayloadAction<string>) => {
            return state.filter((item) => item.id !== action.payload);
        },
        searchItems: (state, action: PayloadAction<string>) => {
            return state.filter((item) => item.title.includes(action.payload));
        },
    },
});

export const { addItem, editItem, deleteItem, searchItems } = itemsSlice.actions;

export default itemsSlice.reducer;