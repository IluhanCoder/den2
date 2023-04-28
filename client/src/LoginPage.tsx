import { useState, useEffect } from "react";
import userService from "./services/user-service";
import { useNavigate } from "react-router-dom";
import { setConnectionHeader } from "./http/http";

const LoginPage = () => {
  const [login, setLogin] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [dbOptions, setDbOptions] = useState<string[]>([]);
  const [selectedDb, setSelectedDb] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const optionsArray = process.env.REACT_APP_DB_URLS?.split(" ")!;
    setDbOptions(optionsArray);
    setSelectedDb(optionsArray[0]);
  }, []);

  const handleLogin = async () => {
    try {
      setConnectionHeader(selectedDb);
      await userService.login(login, password, email);
    } catch (error) {
        alert("помилка авторізації. Переконайтеся, що ви підтвердили пошту");
      return;
    }
    navigate("/main");
  };

  return (
    <div className="flex w-full justify-center p-10">
      <form className="flex flex-col w-fit p-10 bg-gray-100 rounded drop-shadow-lg gap-4">
        <div className="flex justify-center text-xl">
          Вхід в обліковий запис
        </div>
        <div className="flex justify-center gap-2">
          <label>Логін: </label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>
        <div className="flex justify-center gap-2">
          <label>Пошта:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex justify-center gap-2">
          <label>Пароль: </label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>База даних: </label>
          <select
            value={selectedDb}
            onChange={(e) => setSelectedDb(e.target.value)}
          >
            {dbOptions.map((option: string) => {
              return (
                <option key={option} value={option}>
                  {option}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            className="bg-blue-200 hover:bg-blue-300 rounded p-2"
            onClick={handleLogin}
          >
            Увійти
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
