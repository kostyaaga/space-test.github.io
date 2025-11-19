import {
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Items } from "../../types/items";

const LS_KEY = "likedItems_v1";

function loadLikedFromLocalStorage(): Items[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Items[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveLikedToLocalStorage(items: Items[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch {
    console.error("error in saveLikedToLocalStorage");
  }
}

export type FiltersType = {
  name: string;
  filterProperty: "all" | "liked";
};

interface FilterSliceState {
  filter: FiltersType;
  likedItems: Items[];
  searchValue: string;
}

const initialState: FilterSliceState = {
  filter: { name: "Все элементы", filterProperty: "all" },
  likedItems: typeof window !== "undefined" ? loadLikedFromLocalStorage() : [],
  searchValue: "",
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilterId(state, action: PayloadAction<FiltersType>) {
      state.filter = action.payload;
    },

    toggleLike(state, action: PayloadAction<Items>) {
      const item = action.payload;
      const index = state.likedItems.findIndex((obj) => obj.id === item.id);

      if (index === -1) {
        state.likedItems.push(item);
      } else {
        state.likedItems.splice(index, 1);
      }

      saveLikedToLocalStorage(state.likedItems);
    },

    removeLikeById(state, action: PayloadAction<number>) {
      state.likedItems = state.likedItems.filter(
        (it) => it.id !== action.payload,
      );
      saveLikedToLocalStorage(state.likedItems);
    },

    setSearchValue(state, action: PayloadAction<string>) {
      state.searchValue = action.payload;
    },
  },
});

export const selectFilterState = (state: RootState) => state.filter;
export const selectLikedItems = (state: RootState) => state.filter.likedItems;
export const selectIsLiked = (id: number) =>
  createSelector([selectLikedItems], (likedItems) =>
    likedItems.some((item) => item.id === id),
  );

export const { setFilterId, toggleLike, removeLikeById, setSearchValue } =
  filterSlice.actions;
export default filterSlice.reducer;
