import React, { useRef, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import animationSuggest from "@animations/suggest.json";
import "react-tooltip/dist/react-tooltip.css";
import Lottie from "lottie-react";
import classNames from "classnames/bind";
import styles from "./HintTooltip.module.scss";

const cx = classNames.bind(styles);

const HintTooltip = ({
  id,
  message,
  widthIcon = 80,
  heightIcon = 80,
  className,
  classNameLottie,
  classNameTooltip,
  speed = 2,
  tooltipStyle = {},
  loop = true,
}) => {
  const lottieRef = useRef();
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(speed);
    }
  }, [speed]);

  return (
    <div className={className}>
      <div
        data-tooltip-id={id}
        data-tooltip-content={message}
        // onMouseEnter={() => lottieRef.current?.play()}
        // onMouseLeave={() => lottieRef.current?.stop()}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={animationSuggest}
          loop={loop}
          className={classNameLottie}
          style={{ cursor: "pointer", width: widthIcon, height: heightIcon }}
        />
      </div>

      <Tooltip
        id={id}
        place="left"
        strategy="fixed" // giữ vị trí cố định, không auto adjust
        offset={-5}
        className={classNameTooltip}
        style={{
          backgroundColor: "var(--accent1)",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "500",
          borderRadius: "6px",
          padding: "10px 15px",
          zIndex: 9999,
          maxWidth: "400px", // 👈 Giới hạn độ rộng
          whiteSpace: "normal",
          ...tooltipStyle,
        }}
      />
    </div>
  );
};

export default HintTooltip;
