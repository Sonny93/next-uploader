import path from 'path';

function calculSize(size) {
	const units = ['Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'];
	let toReturn;

	for (let mul = 0, approx = size / 1024; approx > 1; approx /= 1024, mul++)
		toReturn = `${approx.toFixed(3)} ${units[mul]}`;

	return toReturn;
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
    constructor({ fileName, size, uploadPath }) {
        const extension = (path.extname(fileName)).substring(1);

        this.name = fileName.substring(0, fileName.length - extension.length - 1);
        this.extension = extension;
        this.type = fileType(extension);

        this.fileName = fileName;
        this.brutSize = size;
        this.size = calculSize(size);
        this.uploadPath = `${uploadPath}/${fileName}`;
    }
}

export { calculSize, fileType, File };