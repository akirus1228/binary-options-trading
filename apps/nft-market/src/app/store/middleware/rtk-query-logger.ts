import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";
import { addAlert, setOpenseaStatus } from "../reducers/app-slice";

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (
      isRejectedWithValue(action) &&
      action.type === "backendApi/executeQuery/rejected"
    ) {
      console.log(action);
      //api.dispatch(setOpenseaStatus(false));
      console.log("NFT Port Error");
    }

    return next(action);
  };
