import { calculSize } from '..';
import { FileAPI } from '../../api';
import { FileFront, FileFrontProtected, FileType } from '../../front.d';

export function FileBuilder({
    file_id,
    name,
    passwordSet,
    fileBrutSize,
    fileExtension,
    createdAt,
    updatedAt
}: FileAPI): FileFront | FileFrontProtected {
    if (passwordSet) {
        return <FileFrontProtected>{
            file_id,
            name,
            passwordSet,
            meta: {
                type: FileTypeBuilder(fileExtension),
                extension: fileExtension
            },
            createdAt,
            updatedAt
        }
    }

    return <FileFront>{
        file_id,
        name,
        passwordSet,
        meta: {
            type: FileTypeBuilder(fileExtension),
            extension: fileExtension
        },
        size: {
            pretty: calculSize(fileBrutSize),
            raw: fileBrutSize
        },
        url: FileUrlBuilder(file_id),
        createdAt,
        updatedAt
    }
}

export function FileTypeBuilder(typeParam: string): FileType {
    const Filetypes = [
        { ext: 'png', type: FileType.IMAGE },
        { ext: 'jpg', type: FileType.IMAGE },
        { ext: 'jpeg', type: FileType.IMAGE },
        { ext: 'gif', type: FileType.IMAGE },
        { ext: 'tiff', type: FileType.IMAGE },
        { ext: 'jfif', type: FileType.IMAGE },
        { ext: 'psd', type: FileType.IMAGE },
        { ext: 'raw', type: FileType.IMAGE },

        { ext: 'mp4', type: FileType.VIDEO },
        { ext: 'mov', type: FileType.VIDEO },
        { ext: 'wmv', type: FileType.VIDEO },
        { ext: 'webm', type: FileType.VIDEO },
        { ext: 'avi', type: FileType.VIDEO },
        { ext: 'flv', type: FileType.VIDEO },
        { ext: 'mkv', type: FileType.VIDEO },
        { ext: 'm4v', type: FileType.VIDEO },

        { ext: 'aif', type: FileType.AUDIO },
        { ext: 'cda', type: FileType.AUDIO },
        { ext: 'mid', type: FileType.AUDIO },
        { ext: 'midi', type: FileType.AUDIO },
        { ext: 'mp3', type: FileType.AUDIO },
        { ext: 'mpa', type: FileType.AUDIO },
        { ext: 'ogg', type: FileType.AUDIO },
        { ext: 'wav', type: FileType.AUDIO },
        { ext: 'wma', type: FileType.AUDIO },
        { ext: 'wpl', type: FileType.AUDIO },

        { ext: 'html', type: FileType.HTML },
        { ext: 'css', type: FileType.CSS },
        { ext: 'js', type: FileType.JAVASCRIPT },
        { ext: 'json', type: FileType.JSON },
        { ext: 'jsx', type: FileType.REACT },
        { ext: 'tsx', type: FileType.REACT },
        { ext: 'ts', type: FileType.TYPESCRIPT },
        { ext: 'txt', type: FileType.PLAINTEXT },

        { ext: 'pdf', type: FileType.PDF },
        { ext: 'cmd', type: FileType.BASH },
        { ext: 'bat', type: FileType.BASH },
        { ext: 'xlsx', type: FileType.EXCEL },
        { ext: 'docx', type: FileType.WORD },
        { ext: 'pptx', type: FileType.POWERPOINT },
        { ext: 'zip', type: FileType.ZIP },

        { ext: 'exe', type: FileType.EXE },
        { ext: 'apk', type: FileType.APK }
    ];

    const type = Filetypes.find(({ ext }) => ext === typeParam);
    return type ? type.type : FileType.OTHER;
}

export function FileUrlBuilder(file_id: string): string {
    const url = `${process.env.UPLOAD_URL}/${file_id}`;
    return url;
}