import { Stepper, Step, StepLabel } from "@mui/material";
import { StepConnector, stepConnectorClasses } from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const steps = ["Chờ xác nhận", "Đã xác nhận", "Đang giao", "Đã giao"];

const OrderProgressBar = ({
  status,
  previousStatus,
}: {
  status: string;
  previousStatus?: string;
}) => {
  const activeStep =
    status === "Đã hủy"
      ? steps.indexOf(previousStatus || "Chờ xác nhận")
      : steps.indexOf(status);

  const CustomConnector = styled(StepConnector)(() => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 17, // đẩy line chiều dọc
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderTopWidth: 6,
      borderColor: "#AFAFAF",
    },
    [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
      borderColor: "#FFC371",
    },
    [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
      borderColor: "#FFC371",
    },
  }));

  const CustomStepIcon = (props: any) => {
    const { active, completed, icon } = props;

    const stepIndex = Number(icon) - 1;
    const isCancelled = status === "Đã hủy" && stepIndex === activeStep;

    const baseStyle = {
      width: 40,
      height: 40,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    if (isCancelled) {
      return (
        <div
          style={{ ...baseStyle, backgroundColor: "#D84315", color: "#FFF" }}
        >
          <CloseIcon style={{ fontSize: 24 }} />
        </div>
      );
    }

    if (completed) {
      return (
        <div
          style={{ ...baseStyle, backgroundColor: "#FFC371", color: "#FFF" }}
        >
          <CheckIcon style={{ fontSize: 24 }} />
        </div>
      );
    }

    return (
      <div
        style={{
          ...baseStyle,
          backgroundColor: completed || active ? "#FFC371" : "#AFAFAF",
          color: "#FFF",
          fontSize: 20,
        }}
      >
        {icon}
      </div>
    );
  };

  return (
    <Stepper
      activeStep={activeStep}
      alternativeLabel
      connector={<CustomConnector />}
    >
      {steps.map((label, index) => {
        const isCancelled = status === "Đã hủy" && index === activeStep;
        const isCompleted =
          index < activeStep ||
          (index === activeStep && index === steps.length - 1); // Đánh dấu check bước cuối cùng

        return (
          <Step key={label} completed={isCompleted}>
            <StepLabel
              StepIconComponent={CustomStepIcon}
              sx={{
                "& .MuiStepLabel-label": {
                  fontSize: "20px",
                  fontWeight: 500,
                  color: isCancelled
                    ? "#D84315"
                    : index < activeStep || index === activeStep
                    ? "#FF9800 !important"
                    : "#AFAFAF",
                },
              }}
            >
              {isCancelled ? "Đã hủy" : label}
            </StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
};

export default OrderProgressBar;
