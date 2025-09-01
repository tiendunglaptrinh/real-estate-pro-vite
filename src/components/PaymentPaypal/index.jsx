// PaymentPaypal.jsx
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import fetchApi from "@utils/fetchApi";
import { SpinnerComponent } from "../component";
import cx from "classnames";
import { useState } from "react";

const PaymentPaypal = ({ orderId }) => {
  const [loading, setLoading] = useState(true);

  if (!orderId) return null;

  return (
    <PayPalScriptProvider
      options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}
    >
      <div className={cx("payment_content", "paypal-wrapper")} style={{ position: "relative" }}>
        {/* Spinner overlay */}

        <PayPalButtons
          createOrder={() => Promise.resolve(orderId)}
          onApprove={async (data) => {
            try {
              const response = await fetchApi(
                `/payment/capture-order/${data.orderID}`,
                { method: "POST" }
              );
              if (response.success) {
                alert("Thanh toán thành công!");
              } else {
                alert(response.message || "Thanh toán thất bại");
              }
            } catch (err) {
              console.error("Capture failed", err);
              alert("Có lỗi khi xác nhận thanh toán");
            }
          }}
          onReady={() => setLoading(false)} // tắt spinner khi button sẵn sàng
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default PaymentPaypal;
