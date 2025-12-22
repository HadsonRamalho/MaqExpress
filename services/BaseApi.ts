import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class BaseApi {
	protected get api() {
		return axios.create({
			baseURL: `${API_URL}/${this.sufixo}`,
		});
	}

	protected readonly sufixo: string;

	constructor(sufixo: string) {
		this.sufixo = sufixo.startsWith("/") ? sufixo.substring(1) : sufixo;
	}
}
