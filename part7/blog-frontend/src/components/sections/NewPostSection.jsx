import { Accordion, AccordionDetails, AccordionSummary, Grid, TextField } from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";

const NewPostSection = () => {

	return (
		<Accordion>
			<AccordionSummary expandIcon={<AddRoundedIcon />}>
				New Post
			</AccordionSummary>
			<AccordionDetails>
				<Grid container>
					<Grid size={12}>
						<TextField />
					</Grid>
				</Grid>
			</AccordionDetails>
		</Accordion>
	);
};

export default NewPostSection;