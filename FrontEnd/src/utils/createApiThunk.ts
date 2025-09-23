import type { AsyncThunkPayloadCreator } from "@reduxjs/toolkit";
import { getApiErrorMessage } from "./apiError";

export const createApiThunk =
    <Returned, ThunkArg>(apiCall: (arg: ThunkArg) => Promise<Returned>, transform?: (data: Returned) => Returned
    ): AsyncThunkPayloadCreator<Returned, ThunkArg, { rejectValue: string }> =>
        async (arg, { rejectWithValue }) => {
            try {
                const result = await apiCall(arg);
                return transform ? transform(result) : result;
            } catch (err) {
                console.log(err)
                return rejectWithValue(getApiErrorMessage(err));
            }
        };
