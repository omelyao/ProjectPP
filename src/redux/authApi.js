import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, refreshToken, setCredentials } from "./authSlice";
import axios from "axios";
import dayjs from "dayjs";
import jwtDecode from "jwt-decode";
import { Mutex } from "async-mutex";

const baseUrl = "http://127.0.0.1:8000/UralIntern/";
//http://studprzi.beget.tech
//http://127.0.0.1:8000

const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.access;
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const mutex = new Mutex();
const baseQueryWithReauth = async (args, api, extraOptions) => {
    console.log(dayjs.unix(api.getState()?.auth?.user?.exp));
    // wait until the mutex is available without locking it
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        // checking whether the mutex is locked
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
                const refreshResult = await baseQuery(
                    {
                        url: "token/refresh/",
                        method: "POST",
                        body: { refresh: api.getState()?.auth?.refresh },
                    },
                    api,
                    extraOptions
                );
                if (refreshResult.data) {
                    api.dispatch(setCredentials(refreshResult.data));
                    // retry the initial query
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    api.dispatch(logOut());
                }
            } finally {
                // release must be called once the mutex should be released again.
                release();
            }
        } else {
            // wait until the mutex is available without locking it
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }
    }
    return result;
};

// const baseQueryWithReauth = async (args, api, extraOptions) => {
//     const { refresh, access, user } = api.getState().auth;

//     console.log("args", args);
//     console.log("api", api);
//     console.log("getState()", api.getState());
//     console.log("extra", extraOptions);
//     console.log(refresh, access, user);

//     if (!access) return await baseQuery(args, api, extraOptions);

//     const isExpired = dayjs.unix(jwtDecode(access)?.exp).diff(dayjs()) < 1;
//     const isExpiredRefresh =
//         dayjs.unix(jwtDecode(refresh)?.exp).diff(dayjs()) < 1;

//     if (isExpiredRefresh) {
//         api.dispatch(logOut());
//         return await baseQuery(args, api, extraOptions);
//     }
//     console.log(dayjs.unix(jwtDecode(access)?.exp));
//     if (!isExpired) return await baseQuery(args, api, extraOptions);
//     console.log(dayjs.unix(jwtDecode(access)?.exp));
//     if (!refreshTokenRequest) refreshTokenRequest = refreshToken(refresh);
//     console.log(refreshTokenRequest);
//     console.log("helloworld");
//     const authObj = await refreshTokenRequest.data;
//     console.log("piece of shit");
//     console.log(authObj);
//     refreshTokenRequest = null;
//     await api.dispatch(setCredentials(authObj));

//     return await baseQuery(args, api, extraOptions);

// const isExpiredRefresh =
//     dayjs.unix(jwtDecode(refresh)?.exp).diff(dayjs()) < 1;

// let result = await baseQuery(args, api, extraOptions);

// if (result?.error?.originalStatus === 401) {
//     if (isExpiredRefresh) {
//         api.dispatch(logOut());
//         return result;
//     }

//     // send refresh token to get new access token

//     const refreshResult = await fetch(`${baseUrl}refresh`, {
//         body: {
//             refresh,
//         },
//         method: "POST",
//     });
//     console.log(refreshResult);

//     if (refreshResult.ok) {
//         const data = refreshResult.json();
//         // store the new token
//         api.dispatch(setCredentials({ ...data }));
//         // retry the original query with new access token
//         result = await baseQuery(args, api, extraOptions);
//     } else {
//         api.dispatch(logOut());
//     }
// }

// return result;
// };

export const AuthApi = createApi({
    reducerPath: "authUralInern",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "token/",
                method: "POST",
                body: { ...credentials },
            }),
        }),
        register: builder.mutation({
            query: (credentials) => ({
                url: "register/",
                method: "POST",
                body: { ...credentials },
            }),
        }),
    }),
});

export const uralInernApi = createApi({
    reducerPath: "uralInern",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getUser: builder.query({
            query: (_) => ({
                url: "user/2",
                method: "GET",
            }),
        }),
    }),
});

export const { useGetUserQuery } = uralInernApi;
export const { useLoginMutation, useRegisterMutation } = AuthApi;
