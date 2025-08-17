import { Accordion, AccordionDetails, AccordionSummary, AccordionGroup, IconButton, Input, Typography, Box, Stack, Textarea, Button, LinearProgress } from "@mui/joy";
import { accordionDetailsClasses } from "@mui/joy/AccordionDetails";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { createPost } from "../../reducers/postReducer";
import { useErrorHandler, useNotify } from "../../hooks";

const NewPostSection = () => {

	const session = useSelector(state => state.session);

	const dispatch = useDispatch();
	const errorHandler = useErrorHandler();
	const notify = useNotify();

	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState(session.status === "stored" ? session.data.user.name : "");
	const [content, setContent] = useState("");
	const [expanded, setExpanded] = useState(false);


	const handlePublish = () => {

		if (session.status !== "stored") return;

		dispatch(createPost({ post: { title, author, content }, token: session.data.user.token }))
			.unwrap()
			.then(() => {

				notify.success("The post was created successfully!");
			})
			.catch(errorHandler);

		setTitle("");
		setAuthor(session.status === "stored" ? session.data.user.name : "");
		setContent("");
		setExpanded(false);
	};

	const edited = title.length > 0;
	const postable = title.length > 0 && author.length > 0 && content.length > 0;

	if (session.status === "fetching") {

		return <LinearProgress color="primary" size="sm" value={25} variant="soft" />;
	}

	if (session.status === "stored")
		return (
			<AccordionGroup
				variant="soft"
				size="lg"
				sx={{
					borderRadius: "sm",
					mb: "1rem"
				}}
			>
				<Accordion
					data-testid="newpost-root"
					expanded={expanded}
					sx={{ p: 0 }}
				>
					<Stack direction="row" sx={{ height: "var(--ListItem-minHeight)" }}>
						<Input
							placeholder="New post..."
							variant="soft"
							sx={{ typography: "h4", flexGrow: 1, boxShadow: "none", pl: "1rem" }}
							value={title}
							onChange={e => {
								setTitle(e.target.value);
								setExpanded(true);
							}}
						/>
						{
							edited
							?
							<Button disabled={!postable} size="sm" onClick={handlePublish} sx={{ m: "0.4em" }}>Share</Button>
							:
							<IconButton variant="plain" sx={{ px: "1em", ":hover": { bgcolor: "transparent" } }} onClick={() => setExpanded(!expanded)}>
								<KeyboardArrowDownIcon sx={{ transform: expanded && "rotate(180deg)", transition: "" }} />
							</IconButton>
						}
					</Stack>
					<AccordionDetails sx={{
						marginInline: 0,
						[`.${accordionDetailsClasses.content}`]: {
							paddingInline: 0,
							p: 0,
						}
					}}>
						<Stack direction="row" sx={{ pl: "1rem" }}>
							<Typography level="body-md" variant="plain" width="fit-content" lineHeight="2em">by</Typography>
							<Input
								placeholder="Author"
								variant="soft"
								sx={{ flexGrow: 1, boxShadow: "none" }}
								value={author}
								onChange={e => setAuthor(e.target.value)}
							/>
						</Stack>
						<Textarea
							sx={{ boxShadow: "none", pl: "1rem" }}
							minRows={3}
							variant="soft"
							placeholder="Your story here..."
							value={content}
							onChange={e => setContent(e.target.value)}
						/>
					</AccordionDetails>
				</Accordion>
			</AccordionGroup>
		);
};

export default NewPostSection;