import { useState, useEffect, useRef } from "react";
import { Blog } from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { LoginForm } from "./components/LoginForm";
import { PostForm } from "./components/PostForm";
import { useNotification } from "./notification";
import { NotificationBody } from "./NotificationBody";
import { Togglable } from "./components/Togglable";

import { Container } from "@mui/material";

const getStoredUser = () => {

	return JSON.parse(window.localStorage.getItem("user"));
};

const App = () => {
	const [posts, setPosts] = useState(null);
	const [user, setUser] = useState(getStoredUser() || null);

	const [notification, notify] = useNotification();

	const togglableRef = useRef();

	const toggleVisibility = () => {

		togglableRef.current.toggleVisibility();
	};

	useEffect(() => {

		blogService.getAll().then(posts_ => {

			setPosts(posts_);
		});
	}, []);

	const logInfo = (...messages) => {

		notify({
			type: "log",
			timeout: 5000,
			messages
		});

		console.log(...messages);
	};

	const logError = (...messages) => {

		notify({
			type: "error",
			timeout: 5000,
			messages
		});

		console.error(...messages);
	};

	const handleLogin = (username, password) => {

		loginService
			.login({username, password})
			.then(data => {

				setUser(data);
				window.localStorage.setItem("user", JSON.stringify(data));

				logInfo("You logged in successfully!");
			})
			.catch(err => {

				if (err.status === 401) {

					logError("Wrong username or password!");
				} else
					console.error(err);
			});
	};

	const handleSavePost = ({title, author, url}) => {

		blogService
			.create({title, author, url}, user.token)
			.then(post => {

				setPosts(posts.concat(post));
				logInfo("You added the post:", post.title, "by", post.author);

				toggleVisibility();
			})
			.catch(err => {

				if (err.response.data.error.includes("token has expired")) {

					alert("Your session seems to be expired, please log in again");
					handleLogout();

				} else
					console.error(err);
			});
	};

	const handleLogout = () => {

		setUser(null);
		window.localStorage.removeItem("user");
	};

	const handleDelete = id => {

		blogService
			.remove(id, user.token)
			.then(() => {

				setPosts(posts.filter(post => post.id !== id));

				logInfo("Post was successfully deleted!");
			})
			.catch(err => {

				if (err.response.data.error.includes("invalid token")) {

					alert("Invalid token");
					handleLogout();

				} else if (err.response.data.error.includes("token has expired")) {

					alert("Your session seems to be expired, please log in again");
					handleLogout();

				} else
					console.error(err);
			});
	};

	const handleLike = (id, likes) => {

		blogService
			.modify(id, {likes}, user.token) // I send PUT request carring 'likes' only, because I`ve implemented "skipping" of the other undefined properties already on the backend side (backend, blogRouter.js)
			.then(post_ => {

				const i = posts.findIndex(post => post.id === post_.id);

				posts.splice(i, 1, post_);

				setPosts(Array.from(posts));
			})
			.catch(err => {

				if (err.response.data.error.includes("invalid token")) {

					alert("Invalid token, please log in");
					handleLogout();

				} else if (err.response.data.error.includes("token has expired")) {

					alert("Your session seems to be expired, please log in again");
					handleLogout();

				} else
					console.error(err);
			});
	};

	if (user) {
		return (
			
			<Container>
				<h2>
					Blogs of <i>{user.name}</i>&nbsp;
					<button onClick={handleLogout}>Log out</button>
				</h2>
				<Togglable ref={togglableRef} buttonLabel="New Post">
					<PostForm onSubmit={handleSavePost} />
				</Togglable>
				<Blog posts={posts} user={user} onDelete={handleDelete} onLike={handleLike} />
				<NotificationBody ofNotification={notification}/>
			</Container>
		);
	} else
		return (<>
			<div>
				<h2>Login</h2>
				<LoginForm onSubmit={handleLogin} />
				<NotificationBody ofNotification={notification}/>
			</div>
			<p>
				<i>* Login session lasts for 15 minutes only!</i>
			</p>
		</>);
};

export default App;