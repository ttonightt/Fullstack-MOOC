export const JSONPrettifier = str => {

	let str_ = "";

	for (const c of str) {

		switch (c) {
			case ",":
				str_ += ", ";
				break;
			case ":":
				str_ += ": ";
				break;
			case "\"":
				break;
			default:
				str_ += c;
		}
	}

	return str_;
};