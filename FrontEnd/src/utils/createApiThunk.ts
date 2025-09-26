import type { AsyncThunkPayloadCreator } from "@reduxjs/toolkit";
import { getApiErrorMessage } from "./apiError";

export const createApiThunk =
    <Returned, ThunkArg = void>(
        apiCall: (arg: ThunkArg) => Promise<Returned>,
        transform?: (data: Returned) => Returned
    ): AsyncThunkPayloadCreator<Returned, ThunkArg, { rejectValue: string }> =>
        async (arg, { rejectWithValue }) => {
            try {
                const result = await apiCall(arg as ThunkArg);
                return transform ? transform(result) : result;
            } catch (err) {
                return rejectWithValue(getApiErrorMessage(err));
            }
        };
