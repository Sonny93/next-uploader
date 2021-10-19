function calculSize(value = 0, decimals = 2) {
    const octets = Number(value);
	if (octets === 0) return '0 Octet';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'];

    const i = Math.floor(Math.log(octets) / Math.log(k));

    return parseFloat((octets / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function fileSafeProps(file) {
    file.size = calculSize(file.fileBrutSize);
    file.url = `${process.env.UPLOAD_URL}/${file.file_id}`;
    
    delete file.password;
    delete file.id;
    // delete file.fileBrutSize;
    delete file.fileSaveAs;
    
    return file;
}

export { calculSize, fileSafeProps };