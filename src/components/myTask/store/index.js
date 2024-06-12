import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  ASSIGN_TASK,
  COMPANY_MEMBERS,
  LEADS,
  USER_TASK,
} from "../../services/apiEndPoints";
import privateRequest from "../../services/privateRequest";
import toast from "react-hot-toast";

const initialState = {
  allTasks: [],
  isLoading: false,
  filter: {},
  leadsList: [],
  companyMembers: [],
  totalCount: null
};

export const getMyTaskList = createAsyncThunk("get/myTask", async (payload) => {
  try {
    const response = await privateRequest.post(USER_TASK, payload);
    return {
      allTasks: response?.data?.data?.TaskList || [],
      totalCount: response?.data?.data?.TotalCount || null
    };
  } catch (err) {
    console.log("err", err);
    toast.error(err);
  }
});

export const getLeadsList = createAsyncThunk("get/leads", async (payload) => {
  try {
    const response = await privateRequest.post(LEADS, payload);
    return {
      leadsList: response.data.data || [],
    };
  } catch (err) {
    toast.error(err);
    console.log("err", err);
  }
});

export const getCompanyMembers = createAsyncThunk(
  "get/companyMembers",
  async (params) => {
    try {
      const response = await privateRequest.get(COMPANY_MEMBERS, { params });
      return {
        companyMembers: response?.data?.data || [],
      };
    } catch (err) {
      toast.error(err);
    }
  }
);

export const addTask = createAsyncThunk(
  "add/task",
  async (payload) => {
    try {
      const response = await privateRequest.post(ASSIGN_TASK, payload);
      toast.success("Task Assigned Successfully");
    } catch (err) {
      toast.error(err);
    }
  }
);

const userSlice = createSlice({
  initialState,
  name: "userTask",
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setClearFilter: (state, action) => {
      state.filter = action.payload;
    },
    removeFromFilterValues: (state, action) => {
      delete state.filter[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyTaskList.fulfilled, (state, action) => {
        state.allTasks = action.payload.allTasks;
        state.totalCount = action.payload.totalCount
        state.isLoading = false;
      })
      .addCase(getMyTaskList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getLeadsList.fulfilled, (state, action) => {
        state.leadsList = action.payload.leadsList;
      })
      .addCase(getCompanyMembers.fulfilled, (state, action) => {
        state.companyMembers = action.payload.companyMembers;
      });
  },
});

export const { setFilter, setClearFilter, removeFromFilterValues } =
  userSlice.actions;
export default userSlice.reducer;
