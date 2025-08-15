import classNames from "classnames/bind";
import style from "./NewPost.module.scss";
import { useState, useEffect } from "react";
import { Button, TransitionPage, Header, Spinner } from "@components/component";
import sell from "@images/sell.png";
import rent from "@images/rent.png";
import { fetchApi } from "@utils/utils";

const cx = classNames.bind(style);

const ContentNewPost = () => {
  const [step1, setStep1] = useState(true);
  const [step2, setStep2] = useState(false);
  const [step3, setStep3] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Options: needs
  const [isSell, setIsSell] = useState(false);
  const [isRent, setIsRent] = useState(false);
  const [needs, setNeeds] = useState(null);
  const handleChooseSell = () => {
    setIsSell(true);
    setIsRent(false);
    setNeeds("sell");
    setCategories([]);
  };
  const handleChooseRent = () => {
    setIsRent(true);
    setIsSell(false);
    setNeeds("rent");
    setCategories([]);
  };

  // Options: address
  const [provinces, setProvinces] = useState([]);
  const [codeProvince, setCodeProvince] = useState("");
  const [wards, setWards] = useState([]);
  const [address, setAddress] = useState({
    provinceCode: "",
    provinceName: "",
    wardCode: "",
    wardName: "",
    wardFullName: "",
    rest: "",
  });
  useEffect(() => {
    const getWardFromProvince = async () => {
      if (!codeProvince) return;
      const url = `location/province/${codeProvince}/ward`;
      const response_data = await fetchApi(url, {
        method: "get",
        skipAuth: true,
      });

      if (response_data.success) {
        setWards(response_data.wards);
      }
    };
    getWardFromProvince();
  }, [codeProvince]);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const url = "/location/province";
        const response_data = await fetchApi(url, {
          method: "get",
          skipAuth: true,
        });

        if (response_data.success) {
          setProvinces(response_data.provinces);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getLocation();
  }, []);

  const handleInputChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  // Options: main info
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [acreage, setAcreage] = useState("");
  const [price, setPrice] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  useEffect(() => {
    if (!needs) return;
    const getCategory = async () => {
      try {
        const url = `/category/${needs}`;
        const response_data = await fetchApi(url, {
          method: "get",
          skipAuth: true,
        });
        setCategories(response_data.categories);
      } catch (err) {
        setError(err.message);
      }
    };
    getCategory();
  }, [needs]);

  const handleChangeCategory = (e) => {
    setCategoryName(e.target.value);
  };

  // Options: Property Component
  const [properties, setProperties] = useState([]);
  const [firstFocus, setFirstFocus] = useState(false);
  useEffect(() => {
    if (!firstFocus) return;
    const getPropertyComponent = async () => {
      const url = "/property/all";
      const response_data = await fetchApi(url, {
        method: "get",
        skipAuth: true,
      });

      console.log(
        ">>> get all property componet: ",
        response_data.list_properties
      );
    };
    getPropertyComponent();
  }, [firstFocus]);

  return (
    <div className={cx("wrapper_new_post")}>
      <div className={cx("left_content")}>
        <div className={cx("new_post_title")}>Tạo tin đăng</div>
        <div className={cx("step_new_post")}>
          <div className={cx("step")}>
            <div className={cx("step_num", { isStep1: step1 })}>1</div>
            <div className={cx("line_step", { isStep1: step1 })}></div>
          </div>
          <div className={cx("step")}>
            <div className={cx("line_step", { isStep2: step2 })}></div>
            <div className={cx("step_num", { isStep2: step2 })}>2</div>
            <div className={cx("line_step", { isStep2: step2 })}></div>
          </div>
          <div className={cx("step")}>
            <div className={cx("line_step", { isStep3: step3 })}></div>
            <div className={cx("step_num", { isStep3: step3 })}>3</div>
          </div>
        </div>
        <div className={cx("info_step")}>
          <div className={cx("info_step_item")}>Thông tin bất động sản</div>
          <div className={cx("info_step_item")}>Hình ảnh</div>
          <div className={cx("info_step_item")}>Thanh toán</div>
        </div>
      </div>
      <div className={cx("right_content")}>
        <div className={cx("box_info")}>
          {/* ----------------- Nhu cầu: Mua/ Bán ------------------ */}
          <div className={cx("info_option")}>
            <div className={cx("option_title")}>Nhu cầu</div>
            <div className={cx("type_estate")}>
              <div
                className={cx("type_sell", { active: isSell })}
                onClick={handleChooseSell}
              >
                <img src={sell} alt="" />
                <div className={cx("sell_title")}>Bán</div>
              </div>
              <div
                className={cx("type_rent", { active: isRent })}
                onClick={handleChooseRent}
              >
                <img src={rent} alt="" />
                <div className={cx("sell_title")}>Thuê</div>
              </div>
            </div>
          </div>
          {/* ----------------- Địa chỉ ------------------ */}
          <div className={cx("info_option")}>
            <div className={cx("option_title")}>Địa chỉ</div>
            <div className={cx("option_address")}>
              <div className={cx("address_part")}>
                {/* Province */}
                <select
                  name="province"
                  className={cx("part_address", "hover_item_light")}
                  value={address.provinceCode || ""}
                  onChange={(e) => {
                    const code = e.target.value;
                    const name =
                      provinces.find((p) => p.code === code)?.name || "";
                    setCodeProvince(code); // fetch wards
                    handleInputChange("provinceCode", code);
                    handleInputChange("provinceName", name);

                    // reset ward khi đổi tỉnh
                    handleInputChange("wardCode", "");
                    handleInputChange("wardName", "");
                    handleInputChange("wardFullName", name);
                  }}
                >
                  <option value="">-- Chọn Tỉnh/Thành phố --</option>
                  {provinces.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </select>

                {/* Ward */}
                <select
                  name="ward"
                  className={cx("part_address", "hover_item_light")}
                  value={address.wardCode || ""}
                  onChange={(e) => {
                    const code = e.target.value;
                    const wardObj = wards.find((w) => w.code === code);
                    handleInputChange("wardCode", code);
                    handleInputChange("wardName", wardObj?.name || "");
                    handleInputChange("wardFullName", wardObj?.fullName || "");
                  }}
                  disabled={!address.provinceCode}
                >
                  <option value="">-- Chọn Xã/Phường --</option>
                  {wards.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.name}
                    </option>
                  ))}
                </select>

                {/* Rest of address */}
                <input
                  type="text"
                  className={cx("part_address", "hover_item_light")}
                  value={address.rest || ""}
                  onChange={(e) => handleInputChange("rest", e.target.value)}
                  placeholder="Đường/Số nhà"
                />
              </div>

              {/* Full Address */}
              <div className={cx("address_full")}>
                {`Địa chỉ hiển thị: ${address.rest} ${address.wardFullName}`}
              </div>
            </div>
          </div>
          {/* ----------------- Thông tin chính bất động sản ------------------ */}
          <div className={cx("info_option")}>
            <div className={cx("option_title")}>Thông tin chính</div>
            <div className={cx("option_sub_title")}>Loại bất động sản</div>
            <select
              className={cx("select_option")}
              name="category"
              value={categoryName}
              onChange={(e) => handleChangeCategory(e)}
            >
              <option value="">-- Chọn loại hình bất động sản --</option>
              {categories.map((ele) => (
                <option key={ele._id} value={ele.category}>
                  {ele.category}
                </option>
              ))}
            </select>
            <div className={cx("wrapper_sub_option")}>
              <div className={cx("sub_info_option")}>
                <div className={cx("option_sub_title")}>Diện tích</div>
                <input
                  type="number"
                  name="acreage"
                  value={acreage}
                  placeholder="Ex: 95.5"
                  onChange={(e) => {
                    setAcreage(e.target.value);
                  }}
                />
                <span className={cx("m2")}>m&sup2;</span>
              </div>
              <div className={cx("sub_info_option")}>
                <div className={cx("option_sub_title")}>Mức giá</div>
                <input
                  type="number"
                  name="price"
                  value={price}
                  placeholder="Ex: 2.5"
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                />
              </div>
              <div className={cx("sub_info_option")}>
                <div className={cx("option_sub_title")}>Đơn vị</div>
                <select name="unitPrice">
                  <option value="milion">Triệu đồng</option>
                  <option value="tens_milion">Chục triệu đồng</option>
                  <option value="hundreds_milion">Trăm Triệu đồng</option>
                  <option value="bilion">Tỷ đồng</option>
                  <option value="milion_per_m2">Triệu đồng/m&sup2;</option>
                  <option value="tens_milion_per_m2">
                    Chục triệu đồng/m&sup2;
                  </option>
                  <option value="hundreds_milion_per_m2">
                    Trăm triệu đồng/m&sup2;
                  </option>
                </select>
              </div>
            </div>
          </div>
          {/* ----------------- Thông tin cơ sở hạ tầng ------------------ */}
          <div className={cx("info_option")}>
            <div className={cx("option_title")}>Cơ sở hạ tầng</div>
            <div className={cx("option_sub_title")}>Nội thất</div>
            <div className={cx("option_sub_item")}>
              <div className={cx("option_sub_title")}>Số phòng</div>
              <div className={cx("num_item")}>
                <div className={cx("minus_num")}>-</div>
                <input type="number" />
                <div className={cx("plus_num")}>+</div>
              </div>
            </div>
            <div className={cx("option_sub_item")}>
              <div className={cx("option_sub_title")}>Số phòng tắm</div>
              <div className={cx("num_item")}>
                <div className={cx("minus_num")}>-</div>
                <input type="number" />
                <div className={cx("plus_num")}>+</div>
              </div>
            </div>
          </div>
          {/* ----------------- Thông tin cơ sở tiện ích ------------------ */}
          <div className={cx("info_option")}>
            <div className={cx("option_title")}>Cơ sở tiện ích</div>
            <div className={cx("option_sub_title")}>Nội thất</div>
            <div className={cx("option_sub_item")}>
              <div className={cx("option_sub_title")}>Số phòng</div>
              <div className={cx("num_item")}>
                <div className={cx("minus_num")}>-</div>
                <input type="number" />
                <div className={cx("plus_num")}>+</div>
              </div>
            </div>
            <div className={cx("option_sub_item")}>
              <div className={cx("option_sub_title")}>Số phòng tắm</div>
              <div className={cx("num_item")}>
                <div className={cx("minus_num")}>-</div>
                <input type="number" />
                <div className={cx("plus_num")}>+</div>
              </div>
            </div>
          </div>
          {/* ----------------- Thông tin Liên hệ ------------------ */}
          <div className={cx("info_option")}>
            <div className={cx("option_title")}>Thông tin liên hệ</div>
            <div className={cx("option_sub_title")}>Tên liên hệ</div>
            <div className={cx("contact_info")}>Tạ Nguyễn Tiến Dũng</div>
            <div className={cx("option_sub_title")}>Email</div>
            <div className={cx("contact_info")}>tanguyentiendung@gmail.com</div>
            <div className={cx("option_sub_title")}>Số điện thoại</div>
            <div className={cx("contact_info")}>0378515369</div>
          </div>
          {/* ----------------- Thông tin Mô tả ------------------ */}
          <div className={cx("info_option")}>
            <div className={cx("option_title")}>Tiêu đề & mô tả</div>
            <div className={cx("option_sub_title")}>Tiêu đề</div>
            <input className={cx("input_tit")} type="text" />
            <div className={cx("option_sub_title")}>Mô tả</div>
            <textarea
              className={cx("input_desc")}
              id="message"
              name="message"
              rows="5"
              cols="30"
              placeholder="Nhập văn bản tại đây..."
            ></textarea>
          </div>
          <Button
            className={cx("submit_step1")}
            width="100px"
            height="100px"
            borderRadius="7px"
            background="#B2935D"
            color="#fff"
          >
            Tiếp theo
          </Button>
          /
        </div>
      </div>
    </div>
  );
};

const NewPost = () => {
  const [transition, setTransition] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setTransition(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [transition]);
  return (
    <>
      {/* <Header /> */}
      {transition && <TransitionPage show={transition} />}
      <ContentNewPost />
    </>
  );
};

export default NewPost;
