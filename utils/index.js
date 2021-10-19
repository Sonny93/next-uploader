import path from 'path';
import { v4 as uuidv4 } from 'uuid';

function calculSize(value = 0, decimals = 2) {
    const octets = Number(value);
	if (octets === 0) return '0 Octet';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'];

    const i = Math.floor(Math.log(octets) / Math.log(k));

    return parseFloat((octets / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function fileType(extension) {
	const images = ['ai', 'bmp', 'gif', 'ico', 'jpeg', 'jpg', 'png', 'ps', 'psd', 'svg', 'tif', 'tiff'];
	const audios = ['aif', 'cda', 'mid', 'midi', 'mp3', 'mpa', 'ogg', 'wav', 'wpl'];
	const videos = ['3g2', '3gp', 'avi', 'h264', 'm4v', 'mkv', 'mov', 'mp4', 'mpg', 'mpeg', 'rm', 'swf', 'vob', 'wmv'];

	if (images.includes(extension)) {
		return 'image';
	} else if (audios.includes(extension)) {
		return 'audio';
	} else if (videos.includes(extension)) {
		return 'video';
	} else {
		return 'other';
	}
}

class File {
    constructor({ id, fileName, size, url }) {
        const extension = (path.extname(fileName)).substring(1);

		this.id = id || uuidv4();
        this.name = fileName.substring(0, fileName.length - extension.length - 1);
        this.extension = extension;
        this.type = fileType(extension);

        this.fileName = fileName;
        this.brutSize = size;
        this.size = calculSize(size);
        this.url = `${url}/${fileName}`;
    }
}

export { calculSize, fileType, File };