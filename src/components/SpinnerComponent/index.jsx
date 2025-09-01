import React from "react";
import classnames from "classnames/bind";
import styles from "./SpinnerComponent.module.scss";

const cx = classnames.bind(styles);

const SpinnerComponent = ({ className }) => {

  return (
    <div className={cx("spinner-overlay", className)}>
      <div className={cx("spinner")}></div>
    </div>
  );
};

export default SpinnerComponent;
