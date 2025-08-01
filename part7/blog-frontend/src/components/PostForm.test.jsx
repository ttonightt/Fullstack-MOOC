import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {PostForm} from "./PostForm";

describe("<PostForm/> testing", () => {

	let container;

	const post = {
		title: "test-title",
		author: "ttonightt",
		url: "example.com"
	};

	const mockHandlerSubmit = vi.fn();

	const user = userEvent.setup();

	beforeEach(() => {

		container = render(<PostForm onSubmit={mockHandlerSubmit}/>).container;

		screen.debug(container);
	});

	test("<PostForm/> sends right credentials through the submit handle", async () => {

		const inputs = screen.getAllByRole("textbox");
		const button = screen.getByTestId("submit-button");

		await userEvent.type(inputs[0], post.title);
		await userEvent.type(inputs[1], post.author);
		await userEvent.type(inputs[2], post.url);

		await userEvent.click(button);

		expect(mockHandlerSubmit.mock.calls).toHaveLength(1);
		expect(mockHandlerSubmit.mock.calls[0][0]).toMatchObject(post);
	});
});