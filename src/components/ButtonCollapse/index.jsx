import React, { useState } from "react";
import classNames from "classnames/bind";
import style from "./buttonCollapse.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(style);

const ButtonCollapse = ({
  width,
  height,
  border,
  borderRadius,
  padding,
  fontSize,
  sizeIcon,
  colorIcon,
  color,
  background,
  content,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false); // State to handle collapse toggle

  const styleWrapper = {
    width: width || "auto",
    height: height || "auto",
  };

  const buttonStyle = {
    border: border || "none",
    borderRadius: borderRadius || "0px",
    backgroundColor: background || "#fff",
    fontSize: fontSize || "inherit",
    padding: padding || "0px",
    color: color || "#000",
  };

  const iconStyle = {
    color: colorIcon || "#000",
    fontSize: sizeIcon || "20px",
  };

  const toggleCollapse = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={cx("wrapper_btn_collapse")} style={styleWrapper}>
      <button
        className={cx("btn_collapse")}
        style={buttonStyle}
        onClick={toggleCollapse}
      >
        {content}
        <FontAwesomeIcon
          className={cx("collapse_icon", { rotated: isOpen })}
          icon={faCaretDown}
          style={iconStyle}
        />
      </button>
      {isOpen && <div className={cx("collapse_content")}>{children}</div>}
    </div>
  );
};

export default ButtonCollapse;
