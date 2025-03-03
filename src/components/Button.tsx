import { useDispatch, useSelector } from 'react-redux';
import { toggleActive, incrementCount } from '../store/buttonSlice';
import { RootState } from '../store';

export interface ButtonProps {
  label?: string;
  onClick?: () => void;
}

const Button = ({ label = 'Click me', onClick }: ButtonProps) => {
  const dispatch = useDispatch();
  const { isActive, clickCount } = useSelector((state: RootState) => state.button);

  const handleClick = () => {
    dispatch(toggleActive());
    dispatch(incrementCount());
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-md ${
        isActive ? '!bg-blue-600' : '!bg-blue-500'
      }`}
    >
      {label} (Clicked: {clickCount})
    </button>
  );
};

export default Button;