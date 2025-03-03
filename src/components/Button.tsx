import { type ReactElement } from "react";

export interface ButtonProps {
  label: string;
  onClick?: () => void;
}

const Button = ({ label, onClick }: ButtonProps): ReactElement => {
  return (
    <button type="button" onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;