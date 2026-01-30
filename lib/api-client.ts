import axios from "axios";
import { API_URL } from "./utils";

const apiClient = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

export default apiClient;
