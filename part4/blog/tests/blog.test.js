const {test, describe} = require("node:test");
const assert = require("node:assert");

const {dummy, totalLikes, blogs, maxLikes, maxPostsAuthor, maxLikesAuthor} = require("../utils/list_testing");


describe("average", () => {

	test("dummy returns 1", () => {

		assert.strictEqual(dummy([]), 1);
	});

	test("total likes quantity", () => {

		assert.strictEqual(totalLikes(blogs), 36);
	});

	test("max likes", () => {

		assert.deepStrictEqual(maxLikes(blogs), blogs.find(post => post.likes === 12));
	});

	test("Author with the most blogs", () => {

		assert.deepStrictEqual(maxPostsAuthor(blogs), {author: "Robert C. Martin", blogs: 3});
	});

	test("Author with the most likes", () => {

		assert.deepStrictEqual(maxLikesAuthor(blogs), {author: "Edsger W. Dijkstra", likes: 17});
	});
});