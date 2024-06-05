import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Item {
    id: string;
    title: string;
    category: string;
}

export interface Container {
    id: string;
    title: string;
    items: Item[];
}

const initialState: Container[] = [];

const containersSlice = createSlice({
    name: 'containers',
    initialState,
    reducers: {
        addContainer: (state, action: PayloadAction<Container>) => {
            state.push(action.payload);
        },
        editContainer: (state, action: PayloadAction<Container>) => {
            const index = state.findIndex((container) => container.id === action.payload.id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        deleteContainer: (state, action: PayloadAction<string>) => {
            return state.filter((container) => container.id !== action.payload);
        },
        addItem: (state, action: PayloadAction<{ containerId: string; item: Item }>) => {
            const container = state.find((container) => container.id === action.payload.containerId);
            if (container) {
                container.items.push(action.payload.item);
            }
        },
        editItem: (state, action: PayloadAction<Item>) => {
            for (const container of state) {
                const index = container.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    container.items[index] = action.payload;
                    break;
                }
            }
        },
        moveItemWithinContainer: (state, action: PayloadAction<{ containerId: string; fromIndex: number; toIndex: number }>) => {
            const container = state.find((container) => container.id === action.payload.containerId);
            if (container) {
                const [movedItem] = container.items.splice(action.payload.fromIndex, 1);
                container.items.splice(action.payload.toIndex, 0, movedItem);
            }
        },
        moveItemToDifferentContainer: (state, action: PayloadAction<{ fromContainerId: string; toContainerId: string; fromIndex: number; toIndex: number }>) => {
            const fromContainer = state.find((container) => container.id === action.payload.fromContainerId);
            const toContainer = state.find((container) => container.id === action.payload.toContainerId);
            if (fromContainer && toContainer) {
                const [movedItem] = fromContainer.items.splice(action.payload.fromIndex, 1);
                toContainer.items.splice(action.payload.toIndex, 0, movedItem);
            }
        },
        moveContainer: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
            const [movedContainer] = state.splice(action.payload.fromIndex, 1);
            state.splice(action.payload.toIndex, 0, movedContainer);
        },
        deleteItem: (state, action: PayloadAction<string>) => {
            state.forEach((container) => {
                container.items = container.items.filter((item) => item.id !== action.payload);
            });
        },
    },
});

export const { addContainer, editContainer, deleteContainer, addItem,editItem, moveItemWithinContainer, moveItemToDifferentContainer, moveContainer, deleteItem } = containersSlice.actions;

export default containersSlice.reducer;