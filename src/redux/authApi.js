import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, refreshToken, setCredentials } from "./authSlice";
import axios from "axios";
import dayjs from "dayjs";
import jwtDecode from "jwt-decode";
import { Mutex } from "async-mutex";

export const domen = "http://127.0.0.1:8000";
//http://studprzi.beget.tech
//http://127.0.0.1:8000

const baseUrl = `${domen}/UralIntern/`;

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
    //console.log(dayjs.unix(api.getState()?.auth?.user?.exp));
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

export const AuthApi = createApi({
    reducerPath: "authUralInern",
    baseQuery: fetchBaseQuery({ baseUrl }),
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
    tagTypes: [
        "user-info",
        "image",
        "role",
        "team",
        "stage",
        "estimate",
        "project",
    ],
    // providesTags: ["product"] - для гетов
    // invalidatesTags: ["product"] - для мутаторов
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getUser: builder.query({
            query: ({ id }) => ({
                url: `user/${id}/`,
                method: "GET",
            }),
            providesTags: ["image"],
        }),
        changeImage: builder.mutation({
            query: ({ id, body }) => ({
                prepareHeaders: (headers) => {
                    headers.set("Content-Type", "multipart/form-data");
                    return headers;
                },
                url: `change-image/${id}/`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["image"],
        }),
        deleteImage: builder.mutation({
            query: ({ id }) => ({
                url: `change-image/${id}/`,
                method: "PUT",
                body: { image: null },
            }),
            invalidatesTags: ["image"],
        }),

        getMyTeams: builder.query({
            query: () => ({
                url: `teams/`,
                method: "GET",
            }),
            providesTags: ["team"],
        }),
        getTeam: builder.query({
            query: ({ id }) => ({
                url: `team/${id}/`,
                method: "GET",
            }),
            providesTags: ["team", "role"],
        }),
        getUserInfo: builder.query({
            query: ({ id }) => ({
                url: `user-info/${id}/`,
                method: "GET",
            }),
            providesTags: ["user-info"],
        }),
        changeUserInfo: builder.mutation({
            query: ({ id, body }) => ({
                url: `user-info/${id}/`,
                method: "PUT",
                body: { ...body },
            }),
            invalidatesTags: ["user-info"],
        }),
        getStages: builder.query({
            query: ({ id }) => {
                const url = id ? `stage/?id_team=${id}` : `stage/`;
                return {
                    url,
                    method: "GET",
                };
            },
            providesTags: ["stage"],
        }),

        getListCriteria: builder.query({
            query: () => ({
                url: "evaluation-criteria/",
                method: "GET",
            }),
        }),
        getListRoles: builder.query({
            query: () => ({
                url: "roles/",
                method: "GET",
            }),
        }),
        changeRole: builder.mutation({
            query: ({ body }) => ({
                url: "change-role/",
                method: "PUT",
                body,
            }),
            invalidatesTags: ["role"],
        }),
        estimate: builder.mutation({
            query: ({ body }) => ({
                url: "estimate/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["estimate"],
        }),
        getEstimations: builder.query({
            query: ({ userId, teamId }) => ({
                url: `estimations/${userId}/${teamId}/`,
                method: "GET",
            }),
            providesTags: ["estimate"],
        }),
        getForms: builder.query({
            query: ({ id }) => ({
                url: `forms/${id}/`,
                method: "GET",
            }),
            providesTags: ["estimate"],
        }),
        getFormForTeam: builder.query({
            query: ({ user_id, team_id }) => ({
                url: `forms-for-team/${user_id}/${team_id}`,
                method: "GET",
            }),
            providesTags: ["estimate"],
        }),
        getProject: builder.query({
            query: ({ id }) => ({
                url: `project/${id}/`,
                method: "GET",
            }),
            providesTags: ["project"],
        }),
        createTeam: builder.mutation({
            query: ({ body }) => ({
                url: "team/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["team", "project"],
        }),
        getTutorsInternts: builder.query({
            query: () => ({
                url: "interns-tutors/",
                method: "GET",
            }),
        }),
        putTeam: builder.mutation({
            query: ({ id, body }) => ({
                url: `team/${id}/`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["team", "project"],
        }),
        putStage: builder.mutation({
            query: ({ id, body }) => ({
                url: `stage/${id}/`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["stage"],
        }),
        // deleteStage: builder.mutation({
        //     query: ({ id }) => ({
        //         url: `stage/${id}/`,
        //         method: "DELETE",
        //     }),
        //     invalidatesTags: ["stage"],
        // }),
        createStage: builder.mutation({
            query: ({ body }) => ({
                url: `stage/`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["stage"],
        }),
        getEstimationForForm: builder.query({
            query: ({ stageId, userId, internId }) => ({
                url: "",
            }),
        }),
    }),
});

export const {
    useGetUserQuery,
    useChangeImageMutation,
    useChangeRoleMutation,
    useChangeUserInfoMutation,
    useCreateTeamMutation,
    useEstimateMutation,
    useGetEstimationsQuery,
    useGetFormForTeamQuery,
    useGetFormsQuery,
    useGetListCriteriaQuery,
    useGetListRolesQuery,
    useGetMyTeamsQuery,
    useGetProjectQuery,
    useGetStagesQuery,
    useGetTeamQuery,
    useGetTutorsInterntsQuery,
    usePutTeamMutation,
    useGetUserInfoQuery,
    useCreateStageMutation,
    usePutStageMutation,
    useLazyGetEstimationForFormQuery,
    useLazyGetEstimationsQuery,
    useLazyGetFormForTeamQuery,
    useLazyGetFormsQuery,
    useLazyGetListCriteriaQuery,
    useLazyGetListRolesQuery,
    useGetEstimationForFormQuery,
    useLazyGetMyTeamsQuery,
    useLazyGetProjectQuery,
    useLazyGetStagesQuery,
    useLazyGetTeamQuery,
    useLazyGetTutorsInterntsQuery,
    useLazyGetUserInfoQuery,
    useLazyGetUserQuery,
    useDeleteImageMutation,
} = uralInernApi;
export const { useLoginMutation, useRegisterMutation } = AuthApi;
