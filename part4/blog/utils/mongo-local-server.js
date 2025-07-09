const { default: MongoMemoryServer } = require("mongodb-memory-server-core");

let server;

const create = async () => {
	
	return MongoMemoryServer
		.create()
		.then(srv => server = srv);
}

const stop = async () => {

	(await server).stop();
};

module.exports = {
	create,
	stop
};