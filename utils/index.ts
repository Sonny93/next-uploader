import { PrismaClient } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import toastr from 'toastr';

import { setError, setUploaded, updateProgress } from '../components/redux';

import { FileType, FileUpload, UserFront } from '../front.d';
import { UserAPI } from '../api';

/**
 * Instance Prisma Client
 * @type {PrismaClient}
 */
export let prisma: PrismaClient;

if (typeof window === 'undefined') {
    if (process.env.NODE_ENV === 'production') {
        prisma = new PrismaClient();
    } else {
        if (!global.prisma) {
            global.prisma = new PrismaClient();
        }
        prisma = global.prisma;
    }
}

/**
 * Fonction permettant de transformer une valeur de bit brute en une chaîne de caractère human-friendly 
 * @param {number} value Valeur brute
 * @param {number} decimals Nombre de decimal 
 * @returns {string} Valeur avec unité (ex: 1000 Ko)
 */
export function calculSize(value: bigint | number = BigInt(0), decimals: number = 2) {
    const octets = Number(value);
    if (octets === 0) return '0 Octet';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'];

    const i = Math.floor(Math.log(octets) / Math.log(k));

    return `${parseFloat((octets / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Fonction permettant de retirer les propriétés à risque d'un objet User
 * @param {UserAPI} User Object UserAPI
 * @returns {UserFront} Retourne un objet UserFront
 */
export function userSafeProps({
    user_id,
    username,
    email,
    createdAt,
    updatedAt
}: UserAPI): UserFront {
    return {
        user_id,
        username,
        email,
        createdAt,
        updatedAt
    }
};

const path = '/icons';
const Icons = [
    { type: FileType.IMAGE, icon: `${path}/image.svg` },
    { type: FileType.VIDEO, icon: `${path}/video.svg` },
    { type: FileType.AUDIO, icon: `${path}/audio.png` },

    { type: FileType.HTML, icon: `${path}/html.png` },
    { type: FileType.XML, icon: `${path}/xml.png` },
    { type: FileType.CSS, icon: `${path}/css.png` },
    { type: FileType.JSON, icon: `${path}/json.png` },
    { type: FileType.SASS, icon: `${path}/sass.png` },
    { type: FileType.JAVASCRIPT, icon: `${path}/javascript.png` },
    { type: FileType.JSON, icon: `${path}/javascript.png` },
    { type: FileType.REACT, icon: `${path}/react.png` },
    { type: FileType.VUEJS, icon: `${path}/vuejs.png` },
    { type: FileType.TYPESCRIPT, icon: `${path}/typescript.png` },

    { type: FileType.PLAINTEXT, icon: `${path}/plaintext.png` },
    { type: FileType.EXCEL, icon: `${path}/excel.png` },
    { type: FileType.WORD, icon: `${path}/word.png` },
    { type: FileType.POWERPOINT, icon: `${path}/powerpoint.png` },
    { type: FileType.PDF, icon: `${path}/pdf.png` },
    { type: FileType.ZIP, icon: `${path}/zip.png` },

    { type: FileType.BASH, icon: `${path}/bash.png` },
    { type: FileType.EXE, icon: `${path}/exe.png` },
    { type: FileType.APK, icon: `${path}/apk.png` },

    { type: 'PROTECTED', icon: `${path}/protected.png` },
    { type: 'OTHER', icon: `${path}/empty-file.png` }
]

export function GetIcon(fileType: string) {
    const { icon } = Icons.find(({ type }) => type === fileType);
    return icon;
}

export const Pluralize = (str: string, num: number): string => `${str}${num > 1 ? 's' : ''}`;

export async function UploadFiles(files: FileUpload[], dispatch) {
    for await (const file of files) {
        const formData = new FormData(); // Payload
        formData.append('file', file);
        formData.append('customName', file?.customName);
        formData.append('password', file?.password);

        try {
            const { data } = await axios.request({
                method: 'post',
                url: '/api/upload',
                data: formData,
                onUploadProgress: ({ loaded, total }) => dispatch(updateProgress({ file, loaded, total }))
            });

            const fileUploaded = data?.file as FileUpload;
            if (!fileUploaded) {
                console.warn('Aucun fichier retourné par le serveur', data);
            }

            dispatch(setUploaded({ file, uploaded: true }));
        } catch (error) {
            const txtError = HandleCatchError(error);
            dispatch(setError(txtError));
            break;
        }
    }
}

export function HandleCatchError(error): string {
    console.log('error handle catch', error)
    let txtError: string;

    if (error.response) {
        const dataError = error.response.data as string;
        if (dataError) {
            txtError = dataError;
        } else {
            txtError = 'Une erreur est survenue lors de l\'upload du fichier';
        }
    } else if (error.request) { // Aucune erreur n'a été retournée par l'api
        txtError = 'Aucune réponse envoyée par le serveur';
    } else {
        txtError = error.message;
    }

    toastr.error(txtError, 'Erreur!');
    console.error(txtError);
    return txtError;
}

interface FetchFileProps {
    src: string;
    password?: string;
    confirmationOnly?: boolean;
    onDownloadProgress?: (progress) => void
}

export async function FetchFile({ src, password, confirmationOnly, onDownloadProgress }: FetchFileProps): Promise<string | null> {
    const headers = {};
    if (password) {
        headers['password'] = password;
    }

    if (confirmationOnly) {
        headers['confirmation-only'] = 'true';
    }

    return axios
        .get(src, {
            headers,
            responseType: 'blob',
            onDownloadProgress
        })
        .then(async ({ data }) => Promise.resolve(confirmationOnly ? null : URL.createObjectURL(data)))
        .catch(async ({ response }: AxiosError) => Promise.reject(JSON.stringify(await response.data.text())));
}