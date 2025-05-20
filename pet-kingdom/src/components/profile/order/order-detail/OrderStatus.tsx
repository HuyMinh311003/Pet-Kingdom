import { useState, useEffect } from "react";
import { UserRole } from "../../../../types/role";
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import "./OrderDetailPage.css";
import { orderApi } from "../../../../services/admin-api/orderApi";
import { useNavigate } from "react-router-dom";

const getNextStatuses = (current: string) => {
  switch (current) {
    case "Chờ xác nhận":
      return ["Đã xác nhận", "Đã hủy"];
    case "Đã xác nhận":
      return ["Đang giao", "Đã hủy"];
    case "Đang giao":
      return ["Đã giao", "Đã hủy"];
    default:
      return [];
  }
};

type StatusHistoryItem = {
  status: string;
  date: string;
  note?: string;
  updatedBy?: string;
};

type Props = {
  role: UserRole;
  initialStatus: string;
  viewMode: "assigned-orders" | "shipper-orders" | "default";
  onStatusChange: (newStatus: string) => void;
  orderId: string;
  statusHistory?: StatusHistoryItem[];
};

const OrderStatus = ({
  role,
  initialStatus,
  viewMode,
  onStatusChange,
  orderId,
  statusHistory = [],
}: Props) => {
  const [previousStatus, setPreviousStatus] = useState<string | undefined>();
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [effectiveStatus, setEffectiveStatus] = useState(initialStatus);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const navigate = useNavigate();

  // Determine the effective status based on status history
  useEffect(() => {
    if (statusHistory.length > 0) {
      // Sort status history by date (newest first)
      const sortedHistory = [...statusHistory].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // If the current status is "Đã hủy", find the status before cancellation
      if (currentStatus === "Đã hủy") {
        // Find the last non-cancelled status
        const lastNonCancelledStatus = sortedHistory.find(
          (item) => item.status !== "Đã hủy"
        );

        if (lastNonCancelledStatus) {
          setEffectiveStatus(lastNonCancelledStatus.status);
        }
      } else {
        setEffectiveStatus(currentStatus);
      }
    } else {
      setEffectiveStatus(currentStatus);
    }
  }, [currentStatus, statusHistory]);

  //Shipper select order
  const handleSelectOrder = async () => {
    try {
      await orderApi.assignOrderToShipper(orderId);
      setOpenConfirmDialog(false);
      navigate("/admin/shipper-orders");
    } catch (error) {
      console.error("Error assigning order", error);
    }
  };

  const handleAdminUpdate = () => {
    if (selectedStatus !== currentStatus) {
      setOpenConfirmDialog(true);
    }
  };

  const confirmAdminChange = async () => {
    try {
      await orderApi.updateOrderStatus(orderId, {
        status: selectedStatus,
      });

      setPreviousStatus(currentStatus); //lưu lại trước khi cập nhật để nếu bấm hủy thì nó nhảy sang kế tiếp, xong nó sẽ lùi và hủy
      setCurrentStatus(selectedStatus);
      onStatusChange(selectedStatus);
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setOpenConfirmDialog(false);
    }
  };

  const handleCustomerClick = () => {
    setOpenCancelDialog(true);
  };

  const confirmCustomerCancel = async () => {
    try {
      await orderApi.updateOrderStatus(orderId, {
        status: "Đã hủy",
      });

      setPreviousStatus(currentStatus);
      setCurrentStatus("Đã hủy");
      onStatusChange("Đã hủy");
    } catch (error) {
      console.error("Error canceling order:", error);
    } finally {
      setOpenCancelDialog(false);
    }
  };

  const cancelDialogs = () => {
    setOpenConfirmDialog(false);
    setOpenCancelDialog(false);
  };

  if (viewMode === "assigned-orders") {
    // Shipper can only select the order
    return (
      <div className="order-status">
        <div className="order-subtitle">Trạng thái đơn hàng: </div>
        <span style={{ fontSize: "18px", margin: "0 20px" }}>
          {currentStatus}
        </span>
        <button
          className="order-status-button"
          onClick={() => setOpenConfirmDialog(true)}
        >
          Chọn đơn hàng
        </button>

        {/* Confirm Select Order Dialog */}
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
            Xác nhận chọn đơn hàng
          </DialogTitle>
          <DialogContentText
            sx={{ fontSize: "16px", color: "#444", pb: 2 }}
            style={{ padding: "0 24px" }}
          >
            Bạn có chắc chắn muốn chọn đơn hàng này?
          </DialogContentText>
          <DialogActions sx={{ justifyContent: "flex-end", marginTop: "40px" }}>
            <Button onClick={cancelDialogs}>Không</Button>
            <Button
              onClick={() => {
                handleSelectOrder();
              }}
              autoFocus
            >
              Có
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  // Shipper (after select order) and Admin can change status
  if (role === "Admin" || viewMode === "shipper-orders") {
    const nextOptions = getNextStatuses(effectiveStatus);

    return (
      <div className="order-status">
        <div className="order-subtitle">Trạng thái đơn hàng: </div>
        <select
          className="order-status-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value={currentStatus}>{currentStatus}</option>
          {nextOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button
          className="order-status-button"
          onClick={handleAdminUpdate}
          disabled={selectedStatus === currentStatus}
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

  // Customer can only cancel the order if status is "Chờ xác nhận"
  return (
    <div className="order-status">
      <div className="order-subtitle">Trạng thái đơn hàng: </div>
      <span style={{ fontSize: "18px", margin: "0 20px" }}>
        {currentStatus}
      </span>
      <button
        className="order-status-button"
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
          Xác nhận hủy đơn hàng
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
