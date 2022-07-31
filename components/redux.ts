import { configureStore, createSlice } from '@reduxjs/toolkit';
import { FileUpload } from '../front';

const fileUploadSlice = createSlice({
    name: 'fileUpload',
    initialState: [] as FileUpload[],
    reducers: {
        addFile: (state: FileUpload[], { payload }: { payload: FileUpload }) => {
            const files = [...state];
            files.push(payload)
            return files;
        },
        deleteFile: (state: FileUpload[], { payload }: { payload: FileUpload }) => {
            const files = [...state];

            const index = files.findIndex((file) => file.name === payload.name);
            if (index !== -1) {
                files.splice(index, 1);
            }

            return files
        },

        setName: (state: FileUpload[], { payload }: { payload }) => {
            const files = [...state];
            const file: FileUpload = payload.file;
            const name: string = payload.name;

            const index = files.findIndex((f) => f.name === file.name);
            if (index !== -1) {
                files[index].customName = name;
            }

            return files;
        },
        setPassword: (state: FileUpload[], { payload }: { payload }) => {
            const files = [...state];

            const file: FileUpload = payload.file;
            const password: string = payload.password;

            const index = files.findIndex((f) => f.name === file.name);
            if (index !== -1) {
                files[index].password = '';
            }

            return files;
        },

        updateProgress: (state: FileUpload[], { payload }: { payload }) => {
            const files = [...state];
            const file: FileUpload = payload.file;
            const loaded: number = payload.loaded;
            const total: number = payload.total;

            const index = files.findIndex((f) => f.name === file.name);
            if (index !== -1) {
                const percent = Math.ceil(((loaded / total) * 100));
                files[index].progress = {
                    ...file.progress,
                    total,
                    loaded,
                    percent,
                    inProgress: percent !== 100
                }
            }

            return files;
        },
        setUploaded: (state: FileUpload[], { payload }: { payload }) => {
            const files = [...state];
            const file: FileUpload = payload.file;
            const fileId: string = payload.fileId;
            const uploaded: boolean = payload.uploaded;

            const index = files.findIndex((f) => f.name === file.name);
            if (index !== -1) {
                files[index].uploaded = uploaded;
                files[index].fileId = fileId;
            }

            return files;
        },

        setError: (state: FileUpload[], { payload }: { payload }) => {
            const files = [...state];
            const file: FileUpload = payload.file;
            const error: any = payload.error; // TODO: changer type

            const index = files.findIndex((f) => f.name === file.name);
            if (index !== -1) {
                files[index].error = error;
                files[index].uploaded = false;
                files[index].progress.loaded = 0;
                files[index].progress.percent = 0;
                files[index].progress.inProgress = false;
            }

            return files;
        },

        clearFiles: (state: FileUpload[], action) => [] as FileUpload[]
    }
});

export const store = configureStore({
    reducer: {
        fileUpload: fileUploadSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
});

export const { addFile, deleteFile, setName, updateProgress, setPassword, setUploaded, setError, clearFiles } = fileUploadSlice.actions;