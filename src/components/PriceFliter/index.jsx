import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./priceFilter.module.scss";

const cx = classNames.bind(styles);

// params là mảng [min, max] nhưng min max ở đây là cho thanh trượt chứ không phải range min max
const PriceFilter = ({
  needs,
  onSubmit,
  onReset,
  min_price_param,
  max_price_param,
}) => {
  let range;
  let step;

  // nếu need là thuê thì range là 0 - 50 triệu và step 1 triệu
  // nếu need là bán thì range là 0 - 20 tỷ và step 100 triệu
  if (needs === "rent") {
    range = [0, 50000000];
    step = 1000000;
  } else if (needs === "sell") {
    range = [0, 20000000000];
    step = 100000000;
  } else {
    range = [0, 20000000000];
    step = 100000000;
  }

  const [priceRange, setPriceRange] = useState([range[0], range[1]]);

  useEffect(() => {
    if (min_price_param || max_price_param) {
      const minPrice = min_price_param ? Number(min_price_param) : range[0];
      const maxPrice = max_price_param ? Number(max_price_param) : range[1];
      setPriceRange([minPrice, maxPrice]);
    } else {
      setPriceRange([range[0], range[1]]);
    }
  }, [min_price_param, max_price_param, needs]);

  const [inputs, setInputs] = useState({
    min: "",
    minUnit: "million",
    max: "",
    maxUnit: "million",
  });

  // ✅ Fix bug hiển thị input sai đơn vị
  useEffect(() => {
    setInputs({
      min:
        priceRange[0] != null
          ? priceRange[0] >= 1e9
            ? Math.floor(priceRange[0] / 1e9).toString()
            : Math.floor(priceRange[0] / 1e6).toString()
          : "",
      minUnit: priceRange[0] >= 1e9 ? "billion" : "million",

      max:
        priceRange[1] != null
          ? priceRange[1] >= 1e9
            ? Math.floor(priceRange[1] / 1e9).toString()
            : Math.floor(priceRange[1] / 1e6).toString()
          : "",
      maxUnit: priceRange[1] >= 1e9 ? "billion" : "million",
    });
  }, [priceRange]);

  useEffect(() => {
    setPriceRange([range[0], range[1]]);
    setInputs({
      min: "",
      minUnit: "million",
      max: "",
      maxUnit: "million",
    });
  }, [needs]);

  // format số thành "triệu", "tỷ"
  const formatPrice = (value) => {
    if (value >= 1e9) {
      return `${value / 1e9} tỷ`;
    } else if (value >= 1e6) {
      return `${value / 1e6} triệu`;
    }
    return `${value}`;
  };

  // khi nhập input
  const handleInputChange = (type, val, unit) => {
    const parsed = Number(val) || 0;
    const valueInDong = unit === "billion" ? parsed * 1e9 : parsed * 1e6;

    if (type === "min") {
      setPriceRange([valueInDong, priceRange[1]]);
      setInputs({ ...inputs, min: val, minUnit: unit });
    } else {
      setPriceRange([priceRange[0], valueInDong]);
      setInputs({ ...inputs, max: val, maxUnit: unit });
    }
  };

  // khi slider thay đổi
  const handleSliderChange = (value) => {
    setPriceRange(value);

    setInputs({
      min:
        value[0] >= 1e9
          ? Math.floor(value[0] / 1e9).toString()
          : Math.floor(value[0] / 1e6).toString(),
      minUnit: value[0] >= 1e9 ? "billion" : "million",
      max:
        value[1] >= 1e9
          ? Math.floor(value[1] / 1e9).toString()
          : Math.floor(value[1] / 1e6).toString(),
      maxUnit: value[1] >= 1e9 ? "billion" : "million",
    });
  };

  // submit
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        min_price: priceRange[0],
        max_price: priceRange[1],
      });
    }
  };

  // reset
  const handleReset = () => {
    setPriceRange([range[0], range[1]]);
    setInputs({ min: "", minUnit: "million", max: "", maxUnit: "million" });

    if (onReset) {
      onReset();
    }
  };

  return (
    <div style={{ width: 300, padding: "1rem" }}>
      <p className={cx("price_filter_text")}>
        {formatPrice(priceRange[0])} → {formatPrice(priceRange[1])}
      </p>
      <Slider
        range
        min={range[0]}
        max={range[1]}
        step={step}
        value={priceRange}
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

      <div className={cx("price_filter_input")}>
        {/* Bắt đầu giá */}
        <div className={cx("wrap_price_item")}>
          <div className={cx("price_title")}>Giá thấp nhất</div>
          <div className={cx("price_num")}>
            <input
              min="0"
              className={cx("input_price")}
              value={inputs.min}
              onChange={(e) =>
                handleInputChange("min", e.target.value, inputs.minUnit)
              }
              placeholder="Từ"
            />
          </div>
          <div className={cx("price_unit")}>
            <select
              className={cx("select_unit")}
              value={inputs.minUnit}
              onChange={(e) =>
                handleInputChange("min", inputs.min, e.target.value)
              }
            >
              <option value="million">Triệu</option>
              <option
                className={cx({ hidden: needs == "rent" })}
                value="billion"
              >
                Tỷ
              </option>
            </select>
          </div>
        </div>

        {/* Kết thúc giá */}
        <div className={cx("wrap_price_item")}>
          <div className={cx("price_title")}>Giá cao nhất</div>
          <div className={cx("price_num")}>
            <input
              className={cx("input_price")}
              value={inputs.max}
              onChange={(e) =>
                handleInputChange("max", e.target.value, inputs.maxUnit)
              }
              placeholder="Đến"
            />
          </div>
          <div className={cx("price_unit")}>
            <select
              className={cx("select_unit")}
              value={inputs.maxUnit}
              onChange={(e) =>
                handleInputChange("max", inputs.max, e.target.value)
              }
            >
              <option value="million">Triệu</option>
              <option
                className={cx({ hidden: needs == "rent" })}
                value="billion"
              >
                Tỷ
              </option>
            </select>
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

export default PriceFilter;
