export default (min = 0, range = 1, round = -1, digits = 0, radix = 10) => {

	const rand = Math.random() * range + min;

	const multiplier = typeof digits === "number" ? radix ** digits : 1;

	switch (round) {
		case -1:
			return rand;
		case 0:
			return Math.floor(rand * multiplier) / multiplier;
		case 1:
			return Math.round(rand * multiplier) / multiplier;
		case 2:
			return Math.ceil(rand * multiplier) / multiplier;
	}
};