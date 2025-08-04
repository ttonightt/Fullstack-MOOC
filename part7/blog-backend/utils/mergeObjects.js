const mergeObjects = (target, source) => {

	const source_ = Object.assign({}, source);

	for (const k in source_)
		if (source_[k] === undefined)
			delete source_[k];

	return Object.assign(target, source_);
};

module.exports = mergeObjects;