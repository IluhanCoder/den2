import $api from "../http/http"
import IUser from "../interfaces/IUser";

export default new class UserService {
    async login(login: string, password: string) {
        try {
            const user = (await $api.post("/login", {login, password})).data;
            localStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
            throw error;
        }
    }

    getUserFromLocalStorage(): IUser {
        try {
            return JSON.parse(localStorage.getItem("user")!);
        } catch (error) {
            throw error;
        }
    }
}