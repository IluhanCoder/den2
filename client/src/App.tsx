import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import MainPage from "./mainPage";
import LoginPage from "./LoginPage";
import EmailConfirmPage from "./emailConfirmPage";

function App() {
  const defaultDB: string = process.env.REACT_APP_DB_URLS?.split(" ")[0]!;

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/main" element={<MainPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/email/:data" element={<EmailConfirmPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
