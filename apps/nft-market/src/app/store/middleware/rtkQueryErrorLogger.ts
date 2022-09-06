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
      action.type === "openseaApi/executeQuery/rejected"
    ) {
      console.log(action);
      api.dispatch(setOpenseaStatus(false));
      api.dispatch(
        addAlert({
          message: "Sorry, we're experiencing delays. Please try again shortly.",
          severity: "error",
        })
      );
    }

    return next(action);
  };
