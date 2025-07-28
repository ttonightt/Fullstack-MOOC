import deepFreeze from "deep-freeze";
import counterReducer from "./reducer";

describe("unicafe reducer", () => {
	const initialState = {
		good: 0,
		ok: 0,
		bad: 0
	};

	test("reducer is immutable function", () => {

		const state = {...initialState};

		const action = {type: "GOOD"};

		deepFreeze(state);

		counterReducer(state, action);
	});

	test("should return a proper initial state when called with undefined state", () => {

		const action = {
			type: "DO_NOTHING"
		};

		const newState = counterReducer(undefined, action);
		expect(newState).toEqual(initialState);
	});

	test("good is incremented", () => {

		const action = {type: "GOOD"};

		const state = {...initialState};

		const newState = counterReducer(state, action);
		expect(newState).toEqual({
			good: 1,
			ok: 0,
			bad: 0
		});
	});

	test("ok is incremented", () => {

		const action = {type: "OK"};

		const state = {...initialState};

		const newState = counterReducer(state, action);
		expect(newState).toEqual({
			good: 0,
			ok: 1,
			bad: 0
		});
	});

	test("bad is incremented", () => {

		const action = {type: "BAD"};

		const state = {...initialState};

		const newState = counterReducer(state, action);
		expect(newState).toEqual({
			good: 0,
			ok: 0,
			bad: 1
		});
	});

	test("zero dispatch works", () => {

		const action = {type: "ZERO"};

		const state = {
			good: 5,
			ok: 1,
			bad: 0
		};

		const newState = counterReducer(state, action);
		expect(newState).toEqual({
			good: 0,
			ok: 0,
			bad: 0
		});
	});
});