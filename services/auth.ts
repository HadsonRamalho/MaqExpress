import type { Login, Register } from "@/interfaces/auth";
import { BaseApi } from "./BaseApi";

class AuthService extends BaseApi {
	constructor() {
		super("user");
	}

	async login(data: Login) {
		try{
		const response = await this.api.post("/login", data);
		const returnedData = response.data;
		console.log(returnedData);
		}
		catch(err){
		throw new Error(`${err}`)
		}
	}

	async register(data: Register) {
		try{
		const response = await this.api.post("/register", data);
		const returnedData = response.data;
		console.log(returnedData);
		} catch(err){
		throw new Error(`${err}`)
		}
	}
}

const serviceAutenticacao = new AuthService();

export { serviceAutenticacao as AuthService };
