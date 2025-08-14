import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import NotificationContainer from "./components/NotificationContainer";
import Notification from "./components/Notification";

import store from "./store";

import "@fontsource/inter";
import { CssBaseline } from "@mui/joy";


ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<BrowserRouter>
			<CssBaseline />
			<NotificationContainer
				data-testid="notifications"
				useNotificationData={() => useSelector(state => state.notification)}
				Template={Notification}
			/>
			<App />
		</BrowserRouter>
	</Provider>
);