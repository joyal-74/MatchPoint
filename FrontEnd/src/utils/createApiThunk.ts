import type { AsyncThunkPayloadCreator, Dispatch } from "@reduxjs/toolkit";
import { getApiErrorMessage } from "./apiError";

export const createApiThunk = <Returned, ThunkArg>(
        apiCall: (arg: ThunkArg, dispatch: Dispatch) => Promise<Returned>,
        transform?: (data: Returned) => Returned
    ): AsyncThunkPayloadCreator<Returned, ThunkArg, { rejectValue: string }> =>
    async (arg, { rejectWithValue, dispatch }) => {
        try {
            const result = await apiCall(arg as ThunkArg, dispatch);
            return transform ? transform(result) : result;
        } catch (err) {
            return rejectWithValue(getApiErrorMessage(err));
        }
    };