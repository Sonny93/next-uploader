export interface FileFront {
    file_id: string;

    name: string;
    passwordSet: boolean;

    size?: {
        pretty: string;
        raw: bigint;
    };

    meta: {
        type: FileType;
        extension?: string;
    };

    url: string;

    createdAt: Date;
    updatedAt: Date;
}

export interface FileFrontProtected {
    file_id: string;

    name: string;
    passwordSet: boolean;

    meta: {
        type: FileType;
        extension?: string;
    };

    createdAt: Date;
    updatedAt: Date;
}

export enum FileType {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    AUDIO = "AUDIO",

    HTML = "HTML",
    SVG = "SVG",
    XML = "XML",
    CSS = "CSS",
    SASS = "SASS",
    JAVASCRIPT = "JAVASCRIPT",
    JSON = "JSON",
    REACT = "REACT",
    VUEJS = "VUEJS",
    TYPESCRIPT = "TYPESCRIPT",
    SQL = "SQL",
    PLAINTEXT = "PLAINTEXT",

    PDF = "PDF",
    EXCEL = "EXCEL",
    WORD = "WORD",
    POWERPOINT = "POWERPOINT",
    ZIP = "ZIP",

    BASH = "BASH",
    EXE = "EXE",
    APK = "APK",

    OTHER = "OTHER",
    PROTECTED = "PROTECTED"
}

export interface UserFront {
    user_id: string;

    username: string;
    email: string;

    createdAt: Date;
    updatedAt: Date;
}

export interface FrontPageProps {
    transitionClass: string;
}

export interface FileUpload extends File {
    fileId?: string;

    name: string;
    size: number;
    type: string;
    lastModified: number;

    customName: string;
    password: string;
    progress: ProgressUpload;

    uploaded: boolean;
    canUpload: boolean;
    error: string | null;
}

export interface ProgressUpload {
    loaded: number;
    total: number;
    percent: number;
    inProgress: boolean;
}