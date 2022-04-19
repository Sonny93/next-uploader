import { PrismaClient } from '@prisma/client';
import { FileType, UserFront } from '../front.d';
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