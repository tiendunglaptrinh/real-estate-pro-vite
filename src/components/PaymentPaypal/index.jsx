// PaymentPaypal.jsx
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import fetchApi from "@utils/fetchApi";
import { SpinnerComponent, Success } from "../component";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

const PaymentPaypal = ({
  orderId,
  postId,
  packagePricingId,
  startDate,
  money,
}) => {
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  if (!orderId) return null;

  return (
    <PayPalScriptProvider
      options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}
    >
      <div style={{ position: "relative" }}>
        {/* Overlay spinner */}
        {loading && (
          <div className="spinner-overlay">
            <SpinnerComponent loading={true} />
          </div>
        )}

        {/* Success portal ra body để full màn hình */}
        {showSuccess &&
          createPortal(<Success />, document.body)}

        <PayPalButtons
          createOrder={() => Promise.resolve(orderId)}
          onApprove={async (data) => {
            try {
              const response = await fetchApi(
                `/payment/capture-order/${data.orderID}`,
                {
                  method: "POST",
                  skipAuth: false,
                  body: {
                    post_id: postId,
                    package_pricing_id: packagePricingId,
                    start_date: startDate,
                    money,
                  },
                }
              );

              if (response.success) {
                setShowSuccess(true);
                setTimeout(() => {
                  navigate("/");
                }, 2000);
              } else {
                alert(response.message || "Thanh toán thất bại");
              }
            } catch (err) {
              console.error("Capture failed", err);
              alert("Có lỗi khi xác nhận thanh toán");
            }
          }}
          onInit={() => setLoading(false)}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default PaymentPaypal;
