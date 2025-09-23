import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./AcreageFilter.module.scss";

const cx = classNames.bind(styles);

const AcreageFilter = ({
  onSubmit,
  onReset,
  min_acreage_param,
  max_acreage_param,
}) => {
  const range = [1, 500];
  const step = 10;

  const [acreageRange, setAcreageRange] = useState([range[0], range[1]]);
  const [inputs, setInputs] = useState({
    min: "",
    max: "",
  });

  // Sync từ URL params hoặc default
  useEffect(() => {
    const minVal =
      min_acreage_param != null ? Number(min_acreage_param) : range[0];
    const maxVal =
      max_acreage_param != null ? Number(max_acreage_param) : range[1];
    setAcreageRange([minVal, maxVal]);
    setInputs({
      min: minVal.toString(),
      max: maxVal.toString(),
    });
  }, [min_acreage_param, max_acreage_param]);

  // khi slider thay đổi
  const handleSliderChange = (value) => {
    setAcreageRange(value);
    setInputs({
      min: Math.floor(value[0]).toString(),
      max: Math.floor(value[1]).toString(),
    });
  };

  // khi nhập input
  const handleInputChange = (type, val) => {
    let newMin = acreageRange[0];
    let newMax = acreageRange[1];
    const parsed = Number(val);

    if (isNaN(parsed)) return; // ignore invalid input

    if (type === "min") {
      newMin = Math.min(Math.max(parsed, range[0]), newMax); // đảm bảo trong range
    } else {
      newMax = Math.max(Math.min(parsed, range[1]), newMin);
    }

    setAcreageRange([newMin, newMax]);
    setInputs({
      min: newMin.toString(),
      max: newMax.toString(),
    });
  };

  // submit
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        min_acreage: acreageRange[0],
        max_acreage: acreageRange[1],
      });
    }
  };

  // reset
  const handleReset = () => {
    setAcreageRange([range[0], range[1]]);
    setInputs({ min: "", max: "" });

    if (onReset) onReset();
  };

  return (
    <div style={{ width: 300, padding: "1rem" }}>
      <p className={cx("acreage_filter_text")}>
        {acreageRange[0]} → {acreageRange[1]} m<sup>2</sup>
      </p>
      <Slider
        range
        min={range[0]}
        max={range[1]}
        step={step}
        value={acreageRange}
        onChange={handleSliderChange}
        trackStyle={[{ backgroundColor: "#e2c594ff" }]}
        handleStyle={[
          {
            width: 22,
            height: 22,
            marginTop: -9,
            borderColor: "#4caf50",
            backgroundColor: "#009ba1",
          },
          {
            width: 22,
            height: 22,
            marginTop: -9,
            borderColor: "#4caf50",
            backgroundColor: "#009ba1",
          },
        ]}
        railStyle={{ backgroundColor: "#ddd" }}
      />

      <div className={cx("acreage_filter_input")}>
        <div className={cx("wrap_acreage_item")}>
          <div className={cx("acreage_title")}>Diện tích nhỏ nhất</div>
          <div className={cx("acreage_num")}>
            <input
              min={range[0]}
              max={range[1]}
              className={cx("input_acreage")}
              value={inputs.min}
              onChange={(e) => handleInputChange("min", e.target.value)}
              placeholder="Từ"
            />
          </div>
        </div>

        <div className={cx("wrap_acreage_item")}>
          <div className={cx("acreage_title")}>Diện tích lớn nhất</div>
          <div className={cx("acreage_num")}>
            <input
              min={range[0]}
              max={range[1]}
              className={cx("input_acreage")}
              value={inputs.max}
              onChange={(e) => handleInputChange("max", e.target.value)}
              placeholder="Đến"
            />
          </div>
        </div>
      </div>

      <div className={cx("wrap_submit_button")}>
        <button
          className={cx("btn_submit_item", "reset")}
          onClick={handleReset}
        >
          Đặt lại
        </button>
        <button
          className={cx("btn_submit_item", "submit")}
          onClick={handleSubmit}
        >
          Áp dụng
        </button>
      </div>
    </div>
  );
};

export default AcreageFilter;
