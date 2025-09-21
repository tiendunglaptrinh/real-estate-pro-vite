import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashBoardUser from "@layouts/DashboardUser";
import classnames from "classnames/bind";
import styles from "./userAccount.module.scss";
import bg_account from "@backgrounds/bg_account.jpg";
import avatar from "@assets/avatar_defaults/male.png";
import { fetchApi } from "@utils/utils";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Success, Spinner } from "@components/component";

const cx = classnames.bind(styles);

const ContentUserAccount = () => {
  const [dataUser, setDataUser] = useState({});
  const [mode, setMode] = useState("view");
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Get data user
  useEffect(() => {
    const getData = async () => {
      const url = "/account/get-info";
      const response_data = await fetchApi(url, {
        method: "get",
        skipAuth: false,
      });

      if (response_data.success) {
        setDataUser(response_data.data);
        setNewFullname(response_data.data.fullname);
        setNewSex(response_data.data.sex);
        setNewBirthday(new Date(response_data.data.birthday));
        return;
      } else return;
    };
    getData();
  }, []);
  const formatSex = (sex) => {
    const sexs = {
      male: "Nam",
      female: "Nữ",
    };

    return sexs[sex] ?? "Không xác định";
  };

  const formatStatusActive = (status) => {
    const statuss = {
      normal: "Đang hoạt động",
    };

    return statuss[status] ?? "Đang hoạt động";
  };

  const COLORS = ["#55d28f", "#009ba1", "#355c7d"];
  const data = [
    { name: "Lượt xem bài viết", value: 120 },
    { name: "Lượt thích bài viết", value: 45 },
    { name: "Lượt xem hồ sơ", value: 30 },
  ];

  // Update form
  const [newFullname, setNewFullname] = useState(dataUser?.fullname || "");
  const [newBirthday, setNewBirthday] = useState(dataUser?.birthday || "");
  const [newSex, setNewSex] = useState(dataUser?.sex || "");

  const handleSubmitUpdate = async () => {
    const body = {
      fullname: newFullname,
      birthday: newBirthday,
      sex: newSex,
    };

    console.log(body);
    const url = "/account/update-info";
    const response_data = await fetchApi(url, {
      body,
      method: "PATCH",
      skipAuth: false,
    });

    if (response_data.success) {
      setSuccess(true);

      // Sau 2s reload lại trang
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  return (
    <>
      {success && <Success />}
      {loading && <Spinner />}
      <div className={cx("form_update_info", { show: showFormUpdate })}>
        <div className={cx("form_update_content")}>
          <FontAwesomeIcon
            className={cx("close_icon")}
            icon={faXmark}
            onClick={() => setShowFormUpdate(false)}
          />

          <div className={cx("sub_update_title")}>Họ và tên</div>
          <input
            className={cx("update_name")}
            placeholder={dataUser.fullname}
            type="text"
            value={newFullname}
            onChange={(e) => setNewFullname(e.target.value)}
          />

          <div className={cx("sub_update_title")}>Ngày tháng năm sinh</div>
          <input
            className={cx("update_birthday")}
            type="date"
            value={newBirthday || ""}
            onChange={(e) => setNewBirthday(e.target.value)}
          />

          <div className={cx("sub_update_title")}>Giới tính</div>
          <div className={cx("radio_item")}>
            <input
              className={cx("input_radio")}
              id="male"
              value="male"
              type="radio"
              checked={newSex === "male"}
              onChange={(e) => setNewSex(e.target.value)}
            />
            <label className={cx("label_sex")} htmlFor="male">
              {" "}
              Nam{" "}
            </label>
          </div>
          <div className={cx("radio_item")}>
            <input
              className={cx("input_radio")}
              id="female"
              value="female"
              type="radio"
              checked={newSex === "female"}
              onChange={(e) => setNewSex(e.target.value)}
            />
            <label className={cx("label_sex")} htmlFor="female">
              {" "}
              Nữ{" "}
            </label>
          </div>

          <div className={cx("group_btn_form")}>
            <button
              className={cx("btn_form_update", "ignore")}
              onClick={() => setShowFormUpdate(false)}
            >
              {" "}
              Hủy bỏ{" "}
            </button>
            <button
              className={cx("btn_form_update", "submit")}
              onClick={handleSubmitUpdate}
            >
              {" "}
              Xác nhận{" "}
            </button>
          </div>
        </div>
      </div>

      <div className={cx("user_account_container")}>
        <h1 className={cx("user_account_title")}>Thông tin cá nhân</h1>
        <div className={cx("user_account_content")}>
          <div className={cx("choose_mode")}>
            <button
              className={cx("btn_mode", { active: mode == "view" })}
              onClick={() => setMode("view")}
            >
              Xem
            </button>
            <button
              className={cx("btn_mode", { active: mode == "edit" })}
              onClick={() => setMode("edit")}
            >
              Chỉnh sửa
            </button>
          </div>
          <div className={cx("user_account_left")}>
            <div className={cx("user_info_top")}>
              <img className={cx("img_avatar")} src={avatar} alt="" />
              <h2 className={cx("user_name")}>Dũng Tiến BDS</h2>
            </div>
            <div className={cx("user_info_bottom")}>
              <div className={cx("sub_title_info")}>Tên đầy đủ</div>
              <input
                readOnly={true}
                className={cx("user_input_info")}
                type="text"
                value={dataUser?.fullname ? dataUser.fullname : ""}
              />
              <div className={cx("sub_title_info")}>Giới tính</div>
              <input
                readOnly={true}
                className={cx("user_input_info")}
                type="text"
                value={dataUser?.sex ? formatSex(dataUser.sex) : ""}
              />
              <div className={cx("sub_title_info")}>Số điện thoại</div>
              <input
                readOnly={true}
                className={cx("user_input_info")}
                type="text"
                value={dataUser?.phone ? dataUser.phone : ""}
              />
              <div className={cx("sub_title_info")}>Ngày tháng năm sinh</div>
              <input
                readOnly={true}
                className={cx("user_input_info")}
                type="text"
                value={
                  dataUser?.birthday
                    ? new Date(dataUser.birthday).toLocaleDateString("vi-VN")
                    : ""
                }
              />
              <div className={cx("sub_title_info")}>Số căn cước công dân</div>
              <input
                readOnly={true}
                className={cx("user_input_info")}
                type="text"
                value={dataUser?.cccd ? dataUser.cccd : ""}
              />
              <button
                className={cx("btn_show_edit_info", { show: mode == "edit" })}
                onClick={() => setShowFormUpdate(true)}
              >
                Chỉnh sửa thông tin
              </button>
            </div>
          </div>
          <div className={cx("user_account_right")}>
            <div className={cx("user_account_system")}>
              <div className={cx("title_info")}>Thông tin tài khoản</div>
              <div className={cx("account_system_item")}>
                <div className={cx("account_system_left")}>
                  <div className={cx("sub_title_info")}>Email </div>
                  <input
                    readOnly={true}
                    className={cx("user_input_info")}
                    type="text"
                    value={dataUser?.email ? dataUser.email : ""}
                  />
                  <div className={cx("sub_title_info")}>Mật khẩu </div>
                  <input
                    readOnly={true}
                    className={cx("user_input_info")}
                    type="password"
                    value={dataUser?.password ? dataUser.password : ""}
                  />
                  <div className={cx("sub_title_info")}>Mức độ xác thực</div>
                  <input
                    readOnly={true}
                    className={cx("user_input_info")}
                    type="text"
                    value={dataUser?.authen ? dataUser.authen : 1}
                  />
                </div>
                <div className={cx("account_system_right")}>
                  <div className={cx("sub_title_info")}>
                    Trạng thái hoạt động
                  </div>
                  <input
                    readOnly={true}
                    className={cx("user_input_info")}
                    type="text"
                    value={
                      dataUser?.status
                        ? formatStatusActive(dataUser.status)
                        : ""
                    }
                  />
                  <div className={cx("sub_title_info")}>
                    Tham gia HomePro từ
                  </div>
                  <input
                    readOnly={true}
                    className={cx("user_input_info")}
                    type="text"
                    value={
                      dataUser?.createdAt
                        ? new Date(dataUser.createdAt).toLocaleDateString(
                            "vi-VN"
                          )
                        : "Không xác định"
                    }
                  />
                </div>
              </div>
            </div>
            <div className={cx("user_account_system")}>
              <div className={cx("title_info")}>Thống kê lượng quan tâm</div>
              <div className={cx("account_system_item")}>
                <div className={cx("section_chart")}>
                  <ResponsiveContainer className={cx("piechart_container")}>
                    <PieChart className={cx("piechart_content")}>
                      <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={5}
                        fill="#8884d8"
                        label
                      >
                        {data.map((entry, index) => (
                          <Cell
                            className={cx("piechart_cell")}
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        iconType="square"
                        wrapperStyle={{
                          width: 200,
                          display: "flex",
                          flexDirection: "column",
                          flexWrap: "nowrap",
                          height: 200,
                          justifyContent: "start",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function UserAccount() {
  return (
    <DashBoardUser>
      <ContentUserAccount />
    </DashBoardUser>
  );
}

export default UserAccount;
