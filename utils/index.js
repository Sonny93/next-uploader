function calculSize(size) {
	const units = ['Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'];
	let toReturn;

	for (let mul = 0, approx = size / 1024; approx > 1; approx /= 1024, mul++)
		toReturn = `${approx.toFixed(3)} ${units[mul]}`;

	return toReturn;
}

export { calculSize };