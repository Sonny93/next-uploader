export interface FileDB {
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
