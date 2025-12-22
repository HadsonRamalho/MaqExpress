import React from "react";
import { Button } from "../ui/button";
import { GrabIcon } from "lucide-react";

type GoogleLoginButtonProps = {
  onClick: () => void;
};

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="flex items-center justify-center gap-2 px-8 py-2 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-100 transition duration-200"
    >
      <GrabIcon className="text-xl" />
      <span className="text-sm font-medium text-gray-600">
        Entrar com o Google
      </span>
    </Button>
  );
};

export default GoogleLoginButton;
