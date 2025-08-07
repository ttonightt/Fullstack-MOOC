import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import NotificationContainer from "./components/NotificationContainer";
import Notification from "./components/Notification";

import store from "./store";

import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const theme = createTheme({
	palette: {
		//mode: "dark",
		//primary: {
		//	main: "#4e8b6f"
		//},
		//background: {
		//	default: "#252927"
		//}
	}
});

ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<NotificationContainer
					useNotificationData={() => useSelector(state => state.notification)}
					Template={Notification}
				/>
				<App />
			</ThemeProvider>
		</BrowserRouter>
	</Provider>
);