import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppThunkConfig } from "../../app/store";

export const createAppThunk = createAsyncThunk.withTypes<AppThunkConfig>();
