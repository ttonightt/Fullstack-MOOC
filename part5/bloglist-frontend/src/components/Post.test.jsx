import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {Blog} from "./Blog";

describe("<Blog/> testing", () => {

	let container;

	const posts = [
		{
			title: "test-title",
			author: "ttonightt",
			url: "example.com",
			user: {
				username: "ttonightt"
			},
			likes: 10
		}
	];
	
	const user = {
		username: "ttonightt"
	};

	const mockHandlerLike = vi.fn();

	const interuser = userEvent.setup();

	beforeEach(() => {

		container = render(<Blog posts={posts} user={user} onLike={mockHandlerLike}/>).container;

		screen.debug(container);
	});

	test("<Blog/> renders title and author by default", () => {

		const title = container.querySelector(".title");
		const author = container.querySelector(".author");

		expect(title).toHaveTextContent(posts[0].title);
		expect(author).toHaveTextContent(posts[0].author);
	});

	test("<Blog/> renders url and likes when toggled", async () => {

		const button = screen.getByTestId("toggle-button");

		await interuser.click(button);

		const url = container.querySelector(".url");
		const likes = container.querySelector(".likes");

		expect(url).toHaveTextContent(posts[0].url);
		expect(likes).toHaveTextContent(posts[0].likes);
	});

	test("<Blog/>'s like handle is called as many times as button 'like' is clicked", async () => {

		const button = screen.getByTestId("like-button");

		await interuser.click(button);
		await interuser.click(button);

		expect(mockHandlerLike.mock.calls).toHaveLength(2);
	});
});