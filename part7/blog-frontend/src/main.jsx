import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import NotificationContainer from "./components/NotificationContainer";
import Notification from "./components/Notification";

import store from "./store";

import "./style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<BrowserRouter>
			<NotificationContainer
				useNotificationData={() => useSelector(state => state.notification)}
				Template={Notification}
			/>
			<App />
		</BrowserRouter>
	</Provider>
);