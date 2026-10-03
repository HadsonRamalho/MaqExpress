import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class BaseApi {
	protected readonly api: AxiosInstance;
	protected readonly sufixo: string;

	constructor(sufixo: string) {
		this.sufixo = sufixo.replace(/^\//, "");

		this.api = axios.create({
			baseURL: `${API_URL}/${this.sufixo}`,
			headers: {
				"Content-Type": "application/json",
			},
		});

		this.api.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				if (typeof window !== "undefined") {
					const token = localStorage.getItem("MAQEXPRESS_TOKEN");
					if (token && config.headers) {
						config.headers.Authorization = `Bearer ${token}`;
					}
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			},
		);
	}
}
