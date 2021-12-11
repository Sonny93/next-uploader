import requestip from 'request-ip';
import { PrismaClient } from '@prisma/client';
import { IncomingMessage } from 'next-connect';
import { log_http, log_connection } from '@prisma/client';

/**
 * Instance Prisma Client
 * @type {PrismaClient}
 */
let prisma;

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
 * @param {int|bigint} value Valeur brute
 * @param {int} decimals Nombre de decimal 
 * @returns {float} Valeur parsée en float
 */
function calculSize(value = 0, decimals = 2) {
    const octets = Number(value);
	if (octets === 0) return '0 Octet';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'];

    const i = Math.floor(Math.log(octets) / Math.log(k));

    return parseFloat((octets / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Fonction permettant de retirer les propriétés à risque d'un objet File
 * @param {*} File Objet de type file
 * @returns {*} Objet de type file
 */
function fileSafeProps(file) {
    file.size = calculSize(file.fileBrutSize);
    file.url = `${process.env.UPLOAD_URL}/${file.file_id}`;
    
    delete file.password;
    delete file.id;
    delete file.fileSaveAs;
    
    return file;
}

/**
 * Fonction permettant de retirer les propriétés à risque d'un objet User
 * @param {*} User Object de type User
 * @returns {*} Objet de type User
 */
function userSafeProps(user) {    
    delete user.id;
    delete user.password;
    
    return user;
}

/**
 * Fonction permettant de créer un log de requête HTTP en base de donnée
 * @param {IncomingMessage} req Requête
 * @returns {log_http|null} Instance de log_http OU null
 */
function createLogHTTP(req) {
    let log;
    try {
        const ip = requestip.getClientIp(req);
        log = prisma.log_http.create({ 
            data: {
                method: req.method,
                url: req.url,
                ip
            } 
        });
    } catch (error) {
        log = null;
        console.error('Unable to create http_log', error);
    }
    return log;
}

/**
 * Fonction permettant de créer un logs de connexion (auth) en base de donnée
 * @param {string} email Adresse mail utilisée
 * @param {IncomingMessage} req Requête
 * @param {boolean} success La tentive est un succès ou non
 * @param {string} message  
 * @returns {log_connection|null} Instance de log_connection OU null
 */
function createConnectionLogs(req, email, success, message) {
    const ip = requestip.getClientIp(req);
    let log;
    try {
        prisma.log_connection.create({
            data: {
                email_used: email,
                ip,
                success,
                message
            }
        });
    } catch (error) {
        log = null;
        console.error('Unable to create log_connection', error);
    }
    return log;
}

export { 
    prisma, 
    calculSize, 
    fileSafeProps, 
    userSafeProps, 
    createLogHTTP, createConnectionLogs
};