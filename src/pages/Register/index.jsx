import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { fetchApi, slugify } from "@utils/utils";
import styles from "./register.module.scss";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import {
  Spinner,
  Success,
  SpinnerComponent,
  Error,
} from "@components/component";

const cx = classNames.bind(styles);

const Register = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingComponent, setLoadingComponent] = useState(false);
  const [messageErr, setMessageErr] = useState("");
  const [secondResend, setSecondResend] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const messageErrorList = {
    otp_failed: "Mã OTP chưa chính xác. Vui lòng kiểm tra lại",
    resend_otp: "Gửi lại mã otp thất bại",
  };

  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    birthday: "",
    sex: "",
    province: "",
    ward: "",
    address: "",
    cccd: "",
    date_cccd: "",
    location_cccd: "",
    otp: "",
    forward_cccd: null,
    backward_cccd: null,
    password: "",
    confirm_password: "",
  });

  const [location, setLocation] = useState([]);
  const [listProvince, setListProvince] = useState([]);
  const [listWard, setListWard] = useState([]);
  const [imgCccd, setImgCccd] = useState([]);
  const navigate = useNavigate();
  const [subAddress, setSubAddress] = useState("");

  useEffect(() => {
    const getDataLocation = async () => {
      const url = "/location/all";
      const response_data = await fetchApi(url, {
        method: "get",
        skipAuth: true,
      });

      if (response_data.success) {
        setLocation(response_data.locations);
        setListProvince(response_data.locations);
        console.log("get location: ", response_data.locations);
      }
    };
    getDataLocation();
  }, []);

  useEffect(() => {
    const fullAddress = [subAddress, formData.ward, formData.province]
      .filter(Boolean) // bỏ mấy cái empty string
      .join(", ");

    if (formData.address !== fullAddress) {
      handleChangeInput("address", fullAddress);
    }
  }, [subAddress, formData.province, formData.ward]);

  const handleChangeInput = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChooseProvince = async (province_name) => {
    const province_slug = slugify(province_name);
    console.log("choosing: ", province_slug);

    const url = "/location/list-ward";
    const response_data = await fetchApi(url, {
      method: "post",
      body: {
        slug: province_slug,
      },
      skipAuth: false,
    });

    if (response_data.success) {
      setListWard(response_data.data);
      handleChangeInput("province", province_name);
      console.log("list ward is: ", response_data.data);
    }
  };

  const handleFileChange = (field, file) => {
    if (!file) return; // tránh lỗi khi không chọn file
    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleSubmit = async () => {
    if (step === 1) {
      const url = "/account/create/step1";
      const response_data = await fetchApi(url, {
        method: "post",
        body: {
          fullname: formData.fullname,
          email: formData.email,
          phone: formData.phone,
          birthday: formData.birthday,
          sex: formData.sex,
          province: formData.province,
          ward: formData.ward,
          address: formData.address,
          cccd: formData.cccd,
          date_cccd: formData.date_cccd,
          location_cccd: formData.location_cccd,
        },
        skipAuth: true,
      });

      if (response_data.success) {
        setStep(2);
      } else {
        alert("Error");
      }
    } else if (step === 2) {
      const url = "/account/create/step2";
      const response_data = await fetchApi(url, {
        method: "post",
        body: {
          otp: formData.otp,
        },
        skipAuth: true,
      });

      if (response_data.success) {
        setStep(3);
      }
    } else if (step === 3) {
      const url = "/account/create/step3";
      const response_data = await fetchApi(url, {
        method: "post",
        body: {
          forward_cccd: formData.forward_cccd,
          backward_cccd: formData.backward_cccd,
        },
        skipAuth: true,
      });
      if (response_data.success) {
        setStep(4);
      } else {
        alert("Error");
      }
    } else if (step === 4) {
      const url = "/account/create/step4";
      const response_data = await fetchApi(url, {
        method: "post",
        body: {
          password: formData.password,
          confirm_password: formData.confirm_password,
        },
        skipAuth: true,
      });
      if (response_data.success) {
        setShowSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
        navigate("/login");
      }
    }
  };

  const handleClickBtnResendOTP = async () => {
    setLoadingComponent(true);
    const url = "/otp/resend";
    const response_data = await fetchApi(url, {
      method: "post",
      body: {
        email: formData["email"] || "tanguyentiendung@gmail.com",
      },
      skipAuth: true,
    });

    if (response_data.success) {
      setError(false);
      setSecondResend(60); // Bắt đầu đếm ngược
      setTimeout(() => setLoadingComponent(false), 500);
    } else {
      setMessageErr(messageErrorList["resend_otp"]);
      setError(true);
      setLoadingComponent(false);
    }
  };

  useEffect(() => {
    let timer;
    if (secondResend > 0) {
      timer = setInterval(() => {
        setSecondResend((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [secondResend]);

  const [showForward, setShowForward] = useState(false);
  const [showBackward, setShowBackward] = useState(false);

  return (
    <>
      {showSuccess && <Success />}
      {loading && <Spinner />}
      {error && <Error />}
      <div className={cx("register_container")}>
        <div className={cx("register_form")}>
          <div className={cx("register_form_left")}>
            <h2 className={cx("title_form")}>Đăng ký - Bước {step}</h2>
          </div>
          <div className={cx("register_form_right")}>
            {step === 1 && (
              <div className={cx("box_info_register")}>
                <div className={cx("box_info_title")}>Thông tin cá nhân</div>
                <div className={cx("sub_info_title")}>Họ và tên</div>
                <input
                  className={cx("basic_info_input")}
                  name="fullname"
                  placeholder="Họ tên"
                  value={formData.fullname}
                  onChange={(e) =>
                    handleChangeInput("fullname", e.target.value)
                  }
                />
                <div className={cx("sub_info_title")}>Email</div>
                <input
                  className={cx("basic_info_input")}
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleChangeInput("email", e.target.value)}
                />
                <div className={cx("wrap_sub_info")}>
                  <div className={cx("wrap_sub_item")}>
                    <div className={cx("sub_info_title")}>Số điện thoại</div>
                    <input
                      className={cx("basic_info_input")}
                      name="phone"
                      placeholder="SĐT"
                      value={formData.phone}
                      onChange={(e) =>
                        handleChangeInput("phone", e.target.value)
                      }
                    />
                  </div>
                  <div className={cx("wrap_sub_item")}>
                    <div className={cx("sub_info_title")}>
                      Ngày tháng năm sinh
                    </div>
                    <input
                      className={cx("basic_info_input")}
                      name="birthday"
                      type="date"
                      value={formData.birthday}
                      onChange={(e) =>
                        handleChangeInput("birthday", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className={cx("sub_info_title")}>Giới tính</div>
                <div className={cx("radio_gender")}>
                  <label className={cx("label_gender")}>
                    <input
                      type="radio"
                      name="sex"
                      value="male"
                      checked={formData.sex === "male"}
                      onChange={(e) => handleChangeInput("sex", e.target.value)}
                    />
                    Nam
                  </label>

                  <label className={cx("label_gender")}>
                    <input
                      type="radio"
                      name="sex"
                      value="female"
                      checked={formData.sex === "female"}
                      onChange={(e) => handleChangeInput("sex", e.target.value)}
                    />
                    Nữ
                  </label>
                </div>

                {/* -- Province -- */}
                <div className={cx("sub_info_title")}>Địa chỉ</div>
                <div className={cx("wrap_address")}>
                  <select
                    className={cx("input_address")}
                    name="province"
                    value={formData.province}
                    onChange={(e) => handleChooseProvince(e.target.value)}
                  >
                    <option value="">-- Chọn tỉnh thành --</option>
                    {listProvince.map((province, index) => (
                      <option key={index} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                  </select>

                  {/* -- Ward -- */}
                  <select
                    className={cx("input_address")}
                    name="ward"
                    value={formData.ward}
                    onChange={(e) => handleChangeInput("ward", e.target.value)}
                  >
                    <option value="">-- Chọn xã/phường --</option>
                    {listWard.map((ward, index) => (
                      <option key={index} value={ward.name}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                  <input
                    className={cx("input_address")}
                    value={subAddress}
                    onChange={(e) => setSubAddress(e.target.value)}
                    type="text"
                    placeholder="Nhập địa chỉ"
                  />
                </div>
                <div className={cx("sub_info_title")}>
                  Thông tin căn cước công dân
                </div>
                <input
                  className={cx("basic_info_input")}
                  name="cccd"
                  placeholder="CCCD"
                  value={formData.cccd}
                  onChange={(e) => handleChangeInput("cccd", e.target.value)}
                />
                <div className={cx("sub_info_title")}>
                  Thời gian và khu vực cấp
                </div>
                <div className={cx("wrap_cccd_info")}>
                  <input
                    className={cx("input_cccd")}
                    name="date_cccd"
                    type="date"
                    value={formData.date_cccd}
                    onChange={(e) =>
                      handleChangeInput("date_cccd", e.target.value)
                    }
                  />
                  <select
                    className={cx("input_cccd")}
                    name="location_cccd"
                    id=""
                    onChange={(e) =>
                      handleChangeInput("location_cccd", e.target.value)
                    }
                  >
                    <option value="">-- Chọn tỉnh thành --</option>
                    {listProvince.map((province, index) => (
                      <option key={index} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className={cx("wrap_otp")}>
                <div className={cx("box_info_title")}>Nhập mã OTP</div>
                <p className={cx("sub_desc")}>
                  OTP được gửi qua email đăng ký của bạn. Vui lòng kiểm tra và
                  thực hiện nhập OTP xác thực
                </p>

                <input
                  className={cx("input_otp")}
                  name="otp"
                  type="number"
                  value={formData.otp}
                  placeholder="Nhập mã OTP"
                  onChange={(e) => handleChangeInput("otp", e.target.value)}
                />
                <div className={cx("wrap_resend")}>
                  <p className={cx("text_resent")}>
                    Nếu bạn chưa nhận được OTP ?
                  </p>
                  <button
                    className={cx("resend_otp")}
                    onClick={handleClickBtnResendOTP}
                    disabled={secondResend > 0} // disable khi đang countdown
                  >
                    Gửi lại
                  </button>
                </div>

                <div
                  className={cx("accept_resend_after", {
                    hidden: secondResend <= 0,
                  })}
                >
                  Có thể gửi lại sau{" "}
                  <span className={cx("num_countdown")}>{secondResend}</span>{" "}
                  Giây
                </div>

                <div className={cx("spinner_wrap")}>
                  {loadingComponent && <SpinnerComponent />}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={cx("wrap_upload_cccd")}>
                <div className={cx("box_info_title")}>
                  Upload hình ảnh căn cước công dân
                </div>
                <button
                  className={cx("btn_ignore_step")}
                  onClick={() => setStep(4)}
                >
                  {" "}
                  Bỏ qua bước này{" "}
                </button>
                <div className={cx("wrapper_cccd")}>
                  <div className={cx("cccd_item")}>
                    <div className={cx("title_upload")}>
                      Upload mặt trước CCCD
                    </div>
                    <label
                      htmlFor="forward_cccd"
                      className={cx("label_img_cccd")}
                    >
                      <FontAwesomeIcon
                        className={cx("icon_upload")}
                        icon={faUpload}
                      />{" "}
                      Mặt trước{" "}
                    </label>
                    <input
                      className={cx("input_file_cccd")}
                      id="forward_cccd"
                      type="file"
                      name="forward_cccd"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          handleFileChange("forward_cccd", url); // lưu URL string
                          setShowForward(true);
                        }
                      }}
                    />
                    <div
                      className={cx("preview_img_cccd", {
                        show: !!formData["forward_cccd"],
                      })}
                    >
                      {formData.forward_cccd && (
                        <img
                          className={cx("img_preview")}
                          src={formData.forward_cccd}
                          alt="Mặt trước CCCD"
                        />
                      )}
                    </div>
                  </div>
                  <div className={cx("cccd_item")}>
                    <div className={cx("title_upload")}>
                      Upload mặt sau CCCD
                    </div>
                    <label
                      htmlFor="backward_cccd"
                      className={cx("label_img_cccd")}
                    >
                      <FontAwesomeIcon
                        className={cx("icon_upload")}
                        icon={faUpload}
                      />
                      Mặt sau
                    </label>
                    <input
                      className={cx("input_file_cccd")}
                      id="backward_cccd"
                      type="file"
                      name="backward_cccd"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          handleFileChange("backward_cccd", url); // lưu URL string
                          setShowForward(true);
                        }
                      }}
                    />
                    <div
                      className={cx("preview_img_cccd", {
                        show: !!formData["backward_cccd"],
                      })}
                    >
                      {formData.backward_cccd && (
                        <img
                          className={cx("img_preview")}
                          src={formData.backward_cccd}
                          alt="Mặt sau CCCD"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className={cx("wrap_password")}>
                <div className={cx("box_info_title")}>Mật khẩu bảo mật</div>
                <div className={cx("form_password")}>
                  <div className={cx("sub_info_title")}>Nhập mật khẩu</div>
                  <input
                    className={cx("input_password")}
                    type="password"
                    name="password"
                    placeholder="****"
                    value={formData.password}
                    onChange={(e) =>
                      handleChangeInput("password", e.target.value)
                    }
                    required
                  />
                  <div className={cx("sub_info_title")}>Nhập lại mật khẩu</div>
                  <input
                    className={cx("input_password")}
                    type="password"
                    name="confirm_password"
                    placeholder="****"
                    value={formData.confirm_password}
                    onChange={(e) =>
                      handleChangeInput("confirm_password", e.target.value)
                    }
                    required
                  />
                  <div className={cx("advice")}>
                    <h3 className={cx("remind")}>Lưu ý:</h3>
                    <p className={cx("advice_item")}>Mật khẩu có độ dài ít nhất là 9 ký tự</p>
                    <p className={cx("advice_item")}>Mật khẩu có thể chứa ký tự chữ cái, chữ số và ký tự đặc biệt</p>
                    <p className={cx("advice_item")}>Nên sử dụng mật khẩu mạnh để đảm bảo an toàn</p>

                  </div>
                </div>
              </div>
            )}

            <div className={cx("actions_btn")}>
              {step > 1 && (
                <button
                  className={cx("btn_action", "back")}
                  onClick={() => setStep(step - 1)}
                >
                  Quay lại
                </button>
              )}
              <button
                className={cx("btn_action", "next")}
                onClick={handleSubmit}
              >
                {step === 4 ? "Hoàn tất" : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
