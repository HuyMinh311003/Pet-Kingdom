import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import "./OrderDetailPage.css";

const getNextStatuses = (current: string) => {
  switch (current) {
    case "Chờ xác nhận":
      return ["Đã xác nhận", "Đã hủy"];
    case "Đã xác nhận":
      return ["Đang giao", "Đã hủy"];
    case "Đang giao":
      return ["Đã giao", "Đã hủy"];
    case "Đã giao":
      return [];
    case "Đã hủy":
      return [];
    default:
      return [];
  }
};

type Props = {
  role: "admin" | "profile";
  initialStatus: string;
  onStatusChange: (newStatus: string) => void;
};

const OrderStatus = ({ role, initialStatus, onStatusChange }: Props) => {
  const [previousStatus, setPreviousStatus] = useState<string | undefined>();
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // admin confirm
  const [openCancelDialog, setOpenCancelDialog] = useState(false); // customer confirm

  const handleAdminUpdate = () => {
    if (selectedStatus !== currentStatus) {
      setOpenConfirmDialog(true);
    }
  };

  const confirmAdminChange = () => {
    setPreviousStatus(currentStatus);
    setCurrentStatus(selectedStatus);
    onStatusChange(selectedStatus);
    setOpenConfirmDialog(false);
  };

  const handleCustomerClick = () => {
    // Chỉ cho phép hủy khi đơn hàng đang ở trạng thái "Chờ xác nhận"
    if (currentStatus === "Chờ xác nhận") {
      setOpenCancelDialog(true);
    }
  };

  const confirmCustomerCancel = () => {
    setPreviousStatus(currentStatus);
    setCurrentStatus("Đã hủy");
    onStatusChange("Đã hủy");
    setOpenCancelDialog(false);
  };

  const cancelDialogs = () => {
    setOpenConfirmDialog(false);
    setOpenCancelDialog(false);
  };

  // ADMIN VIEW
  if (role === "admin") {
    const nextOptions = getNextStatuses(currentStatus);

    return (
      <div className="order-status">
        <div className="order-subtitle">Trạng thái đơn hàng: </div>
        <select
          style={{
            margin: "0px 20px",
            padding: "8px",
            borderRadius: "0.375rem",
            width: "10%",
          }}
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          disabled={nextOptions.length === 0}
        >
          <option value={currentStatus}>{currentStatus}</option>
          {nextOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button
          className="status-button"
          onClick={handleAdminUpdate}
          disabled={selectedStatus === currentStatus || nextOptions.length === 0}
        >
          Cập nhật
        </button>

        {/* Confirm Admin Dialog */}
        <Dialog
          open={openConfirmDialog}
          onClose={cancelDialogs}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: "16px",
              backgroundColor: "#fff",
              width: "500px",
              height: "200px",
            },
          }}
        >
          <DialogTitle
            sx={{ fontWeight: "bold", fontSize: "20px", marginTop: "10px" }}
          >
            Xác nhận cập nhật
          </DialogTitle>
          <DialogContentText
            sx={{ fontSize: "16px", color: "#444", pb: 2 }}
            style={{ padding: "0 24px" }}
          >
            Bạn có muốn chuyển trạng thái đơn hàng sang <b>{selectedStatus}</b>?
          </DialogContentText>
          <DialogActions sx={{ justifyContent: "flex-end", marginTop: "40px" }}>
            <Button onClick={cancelDialogs}>Không</Button>
            <Button onClick={confirmAdminChange} autoFocus>
              Có
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  // CUSTOMER VIEW
  return (
    <div className="order-status">
      <div className="order-subtitle">Trạng thái đơn hàng: </div>
      <span style={{ fontSize: "18px", margin: "0 20px" }}>
        {currentStatus}
      </span>
      <button
        className="status-button"
        onClick={handleCustomerClick}
        disabled={currentStatus !== "Chờ xác nhận"}
      >
        Hủy đơn hàng
      </button>

      {/* Confirm Customer Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={cancelDialogs}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "16px",
            backgroundColor: "#fff",
            width: "500px",
            height: "200px",
          },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: "bold", fontSize: "20px", marginTop: "10px" }}
        >
          Xác nhận hủy đơn
        </DialogTitle>
        <DialogContentText
          sx={{ fontSize: "16px", color: "#444", pb: 2 }}
          style={{ padding: "0 24px" }}
        >
          Bạn có chắc chắn muốn hủy đơn hàng này?
        </DialogContentText>
        <DialogActions sx={{ justifyContent: "flex-end", marginTop: "40px" }}>
          <Button onClick={cancelDialogs}>Không</Button>
          <Button onClick={confirmCustomerCancel} autoFocus>
            Có
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderStatus;
