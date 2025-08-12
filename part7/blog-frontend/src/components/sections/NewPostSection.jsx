import { Accordion, AccordionDetails, AccordionSummary, AccordionGroup, Button, Input, Typography } from "@mui/joy";
import { accordionSummaryClasses } from "@mui/joy/AccordionSummary";
import { accordionDetailsClasses } from "@mui/joy/AccordionDetails";

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
			<AccordionGroup
				variant="soft"
				size="lg"
				sx={{
					borderRadius: "md",
					[`& .${accordionSummaryClasses.button}:hover`]: { bgcolor: "transparent" },
					[`& .${accordionSummaryClasses.root}`]: { px: "1em" },
					[`& .${accordionDetailsClasses.content}`]: { px: "1em" }
				}}
			>
				<Accordion
					expanded={expanded} onChange={() => setExpanded(!expanded)}
				>
					<AccordionSummary>
						<Typography color="neutral" level="h4" fontWeight="xl">New post...</Typography>
					</AccordionSummary>
					<AccordionDetails>
						...
					</AccordionDetails>
				</Accordion>
			</AccordionGroup>
		);
};

export default NewPostSection;