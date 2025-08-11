import { Accordion, AccordionDetails, AccordionSummary, Button, Grid, TextField } from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { createPost } from "../../reducers/postReducer";
import { useEffect } from "react";

const NewPostSection = () => {

	const seshUser = useSelector(state => state.session)?.user;
	const dispatch = useDispatch();

	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState(seshUser?.name);
	const [content, setContent] = useState("");

	const [expanded, setExpanded] = useState(false);

	const handlePublish = () => {

		dispatch(createPost({ post: { title, author, content }, token: seshUser.token }));

		setTitle("");
		setAuthor("");
		setContent("");
		setExpanded(false);
	};

	if (seshUser)
		return (
			<Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
				<AccordionSummary expandIcon={<AddRoundedIcon />}>
					New Post
				</AccordionSummary>
				<AccordionDetails>
					<Grid container>
						<Grid size="grow">
							<TextField
								value={title}
								onChange={e => setTitle(e.target.value)}
								fullWidth
								label="Title"
								multiline
								variant="standard"
							/>
						</Grid>
						<Grid size={3}>
							<TextField
								value={author}
								onChange={e => setAuthor(e.target.value)}
								fullWidth
								label="Author"
								variant="standard"
							/>
						</Grid>
						<Grid size="auto">
							<Button onClick={handlePublish}>Publish</Button>
						</Grid>
						<Grid size={12}>
							<TextField
								value={content}
								onChange={e => setContent(e.target.value)}
								fullWidth
								multiline
								variant="standard"
							/>
						</Grid>
					</Grid>
				</AccordionDetails>
			</Accordion>
		);
};

export default NewPostSection;