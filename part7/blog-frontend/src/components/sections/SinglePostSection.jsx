import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPosts } from "../../reducers/postReducer";
import { useEffect } from "react";


const SinglePostSection = () => {

	const { id } = useParams();

	const post = useSelector(state => state.posts?.find(item => item.id === id));
	const dispatch = useDispatch();

	useEffect(() => {

		if (!post)
			dispatch(fetchPosts());
	}, []);

	if (post) {

		return <p>{post.title}</p>;
	} else {
		return "Loading...";
	}
};

export default SinglePostSection;