import { configureStore, createSlice } from "@reduxjs/toolkit";
import { FileUpload, ProgressUpload } from "../front";

const fileUploadSlice = createSlice({
    name: 'fileUpload',
    initialState: [] as FileUpload[],
    reducers: {
        addFile: (state: FileUpload[], { payload }: { payload: FileUpload }) => { state.push(payload) },
        deleteFile: (state: FileUpload[], { payload }: { payload: FileUpload }) => {
            const index = state.findIndex((file) => file.name === payload.name);
            if (index !== -1) {
                delete state[index];
            }
        },

        setName: (state: FileUpload[], { payload }: { payload }) => {
            const file: FileUpload = payload.file;
            const name: string = payload.name;

            const index = state.findIndex((f) => f.name === file.name);
            if (index !== -1) {
                state[index].customName = name;
            }
        },
        setPassword: (state: FileUpload[], { payload }: { payload }) => {
            const file: FileUpload = payload.file;
            const password: string = payload.password;

            const index = state.findIndex((f) => f.name === file.name);
            if (index !== -1) {
                state[index].password = password;
            }
        },

        updateProgress: (state: FileUpload[], { payload }: { payload }) => {
            const file: FileUpload = payload.file;
            const loaded: number = payload.loaded;

            const index = state.findIndex((f) => f.name === file.name);
            if (index !== -1) {
                const percent = Number(((loaded / file.progress.total) * 100).toFixed(2));
                state[index].progress = {
                    ...file.progress,
                    loaded,
                    percent,
                    inProgress: percent === 100
                }
            }
        },
        setUploaded: (state: FileUpload[], { payload }: { payload }) => {
            const file: FileUpload = payload.file;
            const uploaded: boolean = payload.uploaded;

            const index = state.findIndex((f) => f.name === file.name);
            if (index !== -1) {
                state[index].uploaded = uploaded;
            }
        },

        setError: (state: FileUpload[], { payload }: { payload }) => {
            const file: FileUpload = payload.file;
            const error: any = payload.error; // TODO: changer type

            const index = state.findIndex((f) => f.name === file.name);
            if (index !== -1) {
                state[index].error = error;
                state[index].uploaded = false;
                state[index].progress.loaded = 0;
                state[index].progress.percent = 0;
                state[index].progress.inProgress = false;
            }
        },
    }
});

export const store = configureStore({
    reducer: {
        fileUpload: fileUploadSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
});

export const { addFile, deleteFile, setName, updateProgress, setPassword, setUploaded, setError } = fileUploadSlice.actions;