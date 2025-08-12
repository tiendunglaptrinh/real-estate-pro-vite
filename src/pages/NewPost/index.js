import classNames from "classnames/bind";
import style from "./NewPost.module.scss";
import { Header } from "../../components/component";
import { useState, useEffect } from "react";
import sell from "../../assets/images/sell.png";
import rent from "../../assets/images/rent.png";
import { Button } from "../../components/component";
import axios from "axios";

const cx = classNames.bind(style);

useEffect = () => {
  const fetchDataUser = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_DOMAIN_HOST}/user/get-info`)
    } catch (error) {}
  };
};

const ContentNewPost = () => {
  const [step1, setStep1] = useState(true);
  const [step2, setStep2] = useState(false);
  const [step3, setStep3] = useState(false);
  const [isSell, setIsSell] = useState(false);
  const [isRent, setIsRent] = useState(false);

  const handleChooseSell = () => {
    setIsSell(true);
    setIsRent(false);
  };
  const handleChooseRent = () => {
    setIsRent(true);
    setIsSell(false);
  };
  const [address, setAddress] = useState({
    city: "",
    district: "",
    ward: "",
  });

  const handleInputChange = (field, value) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitStep1 = () => {

  }

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
          <div className={cx("info_option")}>
            <div className={cx("option_title")}>Địa chỉ</div>
            <div className={cx("optiton_adress")}>
              {/* Input con: Xã/Phường */}
              <div className={cx("child_adress")}>
                <div className={cx("address_option")}>
                  Xã/Phường
                  <input
                    type="text"
                    value={address.ward}
                    onChange={(e) => handleInputChange("ward", e.target.value)}
                  />
                </div>
                {/* Input con: Quận/Huyện */}
                <div className={cx("address_option")}>
                  Quận/Huyện
                  <input
                    type="text"
                    value={address.district}
                    onChange={(e) =>
                      handleInputChange("district", e.target.value)
                    }
                  />
                </div>
                {/* Input con: Tỉnh/Thành phố */}
                <div className={cx("address_option")}>
                  Tỉnh/Thành phố
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
              </div>

              {/* Input cha: Hiển thị theo thứ tự */}
              <input
                className={cx("parent_address")}
                type="text"
                value={`${address.ward} ${address.district} ${address.city}`}
                readOnly
              />
            </div>
          </div>
          <div className={cx("info_option")}>
            <div className={cx("option_title")}>Thông tin chính</div>
            <div className={cx("option_sub_title")}>Loại bất động sản</div>
            <select className={cx("select_option")} name="" id="">
              <option value="">Nhà ở riêng</option>
              <option value="">Chung cư</option>
              <option value="">Căn hộ mini</option>
            </select>
            <div className={cx("wrapper_sub_option")}>
              <div className={cx("sub_info_option")}>
                <div className={cx("option_sub_title")}>Diện tích</div>
                <input type="number" name="" id="" />
                <span className={cx("m2")}>m2</span>
              </div>
              <div className={cx("sub_info_option")}>
                <div className={cx("option_sub_title")}>Mức giá</div>
                <input type="number" name="" id="" />
              </div>
              <div className={cx("sub_info_option")}>
                <div className={cx("option_sub_title")}>Đơn vị</div>
                <select name="" id="">
                  <option value="">Triệu đồng</option>
                  <option value="">Tỷ đồng</option>
                  <option value="">Triệu đồng/m2</option>
                </select>
              </div>
            </div>
          </div>
          <div className={cx("info_option")}>
            <div className={cx("option_title")}>Thông tin khác</div>
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
          <div className={cx("info_option")}>
            <div className={cx("option_title")}>Thông tin liên hệ</div>
            <div className={cx("option_sub_title")}>Tên liên hệ</div>
            <div className={cx("contact_info")}>Tạ Nguyễn Tiến Dũng</div>
            <div className={cx("option_sub_title")}>Email</div>
            <div className={cx("contact_info")}>tanguyentiendung@gmail.com</div>
            <div className={cx("option_sub_title")}>Số điện thoại</div>
            <div className={cx("contact_info")}>0378515369</div>
          </div>
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
  return (
    <>
      {/* <Header /> */}
      <ContentNewPost />
    </>
  );
};

export default NewPost;
