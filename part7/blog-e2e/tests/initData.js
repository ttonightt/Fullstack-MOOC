const initUsers = [
	{
		username: "safranek",
		name: "Safranek",
		password: "safranek123"
	},
	{
		username: "teufel",
		name: "Fritz T.",
		password: "SAFRANEK!"
	},
	{
		username: "therealgatto",
		name: "Giovanni Gatto",
		password: "$yndiCATe"
	}
];

const initPosts = [
	{
		title: "Post 1",
		author: "Author 1",
		content: "Content 1",
		__user__: 0
	},
	{
		title: "Post 2",
		author: "Author 2",
		content: "Content 2",
		__user__: 1
	},
	{
		title: "Post 3",
		author: "Author 3",
		content: "Content 3",
		__user__: 2
	}
];

module.exports = { initPosts, initUsers };