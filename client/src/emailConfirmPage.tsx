import { useParams } from "react-router-dom";
import { useEffect } from "react";
import userService from "./services/user-service";

const EmailConfirmPage = () => {
  const { data } = useParams();

  const handleEmail = async () => {
    try {
      await userService.verify(data!);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    handleEmail();
  }, []);

  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-row justify-center">
        Email успішно підтверджено!
      </div>
    </div>
  );
};

export default EmailConfirmPage;
