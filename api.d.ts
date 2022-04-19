export interface FileAPI {
    id: number;
    file_id: string;

    name: string;
    password: string;
    passwordSet: boolean;

    fileBrutSize: bigint;
    fileSaveAs: string;
    fileExtension: string;
    fileMimeType: string;

    createdAt: Date;
    updatedAt: Date;
}

export interface UserAPI {
    id: number;
    user_id: string;

    username: string;
    email: string;
    password: string;

    createdAt: Date;
    updatedAt: Date;
}