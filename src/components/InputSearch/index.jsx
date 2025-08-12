import React from "react";
import classNames from "classnames/bind";
import style from "./inputSearch.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(style);
function InputSearch({
  width,
  height,
  background,
  className,
  borderRadius,
  border,
  padding,
  sizeInput,
  sizeIcon,
  colorIcon,
  onChange,
  children
}) {
  const inputStyle = {
    width: width || "auto",
    height: height || "auto",
    backgroundColor: background || "#fff",
    borderRadius: borderRadius || "10px",
    border: border || "none",
    padding: padding || "2px 16px",
    fontSize: sizeInput
  };
  const iconStyle = {
    fontSize: sizeIcon,
    color: colorIcon || "",
  }
  return (
    <div className={cx('wrapper_input_search')}>
      <FontAwesomeIcon className={cx('icon_search')} icon={faMagnifyingGlass} style={iconStyle} />
      <input className={className} type="text" style={inputStyle} onChange={onChange}/>
      {children}
    </div>
  )
}

export default InputSearch;
