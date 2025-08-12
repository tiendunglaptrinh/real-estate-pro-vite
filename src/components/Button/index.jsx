import React from "react";
import classnames from "classnames";

function Button({
  size,
  width,
  height,
  background,
  className,
  color,
  borderRadius,
  border,
  padding,
  fontSize,
  onClick,
  disabled,
  children,
}) {
  if (size === "small") {
    width = "100px";
    height = "50px";
  } else if (size === "large") {
    width = "400px";
    height = "200px";
  }
  const buttonStyle = {
    size: size || "small",
    width: width || "auto",
    height: height || "auto",
    backgroundColor: disabled ? "#ccc" : background,
    color: color || "#000",
    borderRadius: borderRadius || "10px",
    border: border || "none",
    cursor: disabled ? "not-allowed" : "pointer",
    padding: padding || "8px 16px",
    fontSize: fontSize || "16px",
  };
  return <button className={classnames(className)} disabled={disabled} style={buttonStyle} onClick={onClick}>{children}</button>;
}

export default Button;
