import { useState } from "react";
import classnames from "classnames/bind";
import styles from "./deposit.module.scss";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { fetchApi } from "@utils/utils";
import { createPortal } from "react-dom";
import { SpinnerComponent, Success } from "@components/component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";

const cx = classnames.bind(styles);

const DepositForm = () => {
  const [amount, setAmount] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCreateOrder = async () => {
    if (!amount || Number(amount) <= 0) return alert("Nhập số tiền hợp lệ!");

    setLoading(true);
    try {
      const response = await fetchApi(`/payment/create-order/${amount}`, {
        method: "POST",
        skipAuth: false,
      });

      if (response.success) {
        setOrderId(response.orderID);
      } else {
        alert(response.message || "Tạo order thất bại");
      }
    } catch (err) {
      console.error("Create order error:", err);
      alert("Có lỗi khi tạo order PayPal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx("deposit_container")}>
      {/* Overlay Success */}
      {showSuccess && createPortal(<Success />, document.body)}

      {/* Input số tiền */}
      {!orderId && (
        <div className={cx("deposit_form")}>
          <div className={cx("deposit_title")}>Nạp tiền</div>
          <div className={cx("deposit_info")}>
            <div className={cx("deposit_info_form")}>
              <div className={cx("deposit_name")}>Chủ tài khoản</div>
              <div className={cx("deposit_money")}>Tạ Nguyễn Tiến Dũng</div>
            </div>
            <div className={cx("sub_title")}>Phương thức nạp tiền</div>
            <div className={cx("deposit_method")}>
              <div className={cx("method_item", "paypal")}>
                <FontAwesomeIcon fontSize="15px" icon={faPaypal} />
                Paypal
              </div>
              <div className={cx("method_item", "qrcode")}>
                <div className={cx("overlay_qr")}>Coming soon!</div>
                <FontAwesomeIcon fontSize="15px" icon={faQrcode} />
                QRcode
              </div>
            </div>
          </div>
          <div className={cx("deposit_process")}>
            <input
              type="number"
              placeholder="Nhập số tiền muốn nạp (VND)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={cx("deposit_input")}
            />
            <button onClick={handleCreateOrder} className={cx("deposit_btn")}>
              Nạp tiền
            </button>
          </div>
          {loading && (
            <div className={cx("spiner_loading")}>
              <SpinnerComponent loading={true} />
            </div>
          )}
        </div>
      )}

      {/* Spinner */}

      {/* PayPal Buttons */}
      {orderId && (
        <div className={cx("deposit_form")}>
          <div className={cx("title_payment")}>Tiếp tục thanh toán</div>
          <PayPalScriptProvider
          options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}
        >
          <div style={{ position: "relative" }}>
            <PayPalButtons
              createOrder={() => Promise.resolve(orderId)}
              onApprove={async (data) => {
                try {
                  const res = await fetchApi(
                    `/payment/capture-deposit/${data.orderID}`,
                    {
                      method: "POST",
                      skipAuth: false,
                      body: { money: amount },
                    }
                  );

                  if (res.success) {
                    setShowSuccess(true);
                    setTimeout(() => {
                      window.location.reload();
                    }, 2000);
                  } else {
                    alert(res.message || "Nạp tiền thất bại");
                  }
                } catch (err) {
                  console.error("Capture deposit error:", err);
                  alert("Có lỗi khi xác nhận nạp tiền");
                }
              }}
            />
          </div>
        </PayPalScriptProvider>
        </div>
      )}
    </div>
  );
};

export default DepositForm;
