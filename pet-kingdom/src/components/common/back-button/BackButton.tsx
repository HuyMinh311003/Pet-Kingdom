import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./BackButton.css";

type BackButtonProps = {
  fallbackPath?: string;
  style?: React.CSSProperties;
};

const BackButton = ({ fallbackPath, style }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else if (fallbackPath) {
      navigate(fallbackPath);
    } else {
      navigate("/");
    }
  };

  return (
    <button className="back-button" onClick={handleBack} style={style}>
      <ArrowBackIcon className="back-icon" />
    </button>
  );
};

export default BackButton;
