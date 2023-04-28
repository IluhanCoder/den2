import $api from "../http/http";
import IUser from "../interfaces/IUser";

export default new (class UserService {
  async login(login: string, password: string, email: string) {
    try {
      const user = (await $api.post("/login", { login, password, email })).data;
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

  async verify(data: string) {
    try {
        await $api.get(`/verify/${data}`);
    } catch (error) {
        throw error;
    }
  }
})();
