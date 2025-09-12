// src/pages/UserWallet/UserWallet.jsx
import DashBoardUser from "@layouts/DashboardUser";
import styles from "./userWallet.module.scss";
import classnames from "classnames/bind";
import { useState, useEffect, memo  } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { fetchApi } from "@utils/utils";

const cx = classnames.bind(styles);

// ===================== Dữ liệu cứng nhiều tháng =====================
const transactions = [
  // Tháng 9
  {
    id: "TXN001",
    type: "Nạp tiền",
    amount: 1000000,
    balanceBefore: 0,
    balanceAfter: 1000000,
    date: "2025-09-01",
  },
  {
    id: "TXN002",
    type: "Thanh toán Standard",
    amount: -200000,
    balanceBefore: 1000000,
    balanceAfter: 800000,
    date: "2025-09-05",
  },
  {
    id: "TXN003",
    type: "Nạp tiền",
    amount: 500000,
    balanceBefore: 800000,
    balanceAfter: 1300000,
    date: "2025-09-08",
  },
  {
    id: "TXN004",
    type: "Thanh toán Premium",
    amount: -400000,
    balanceBefore: 1300000,
    balanceAfter: 900000,
    date: "2025-09-12",
  },
  {
    id: "TXN005",
    type: "Thanh toán Started",
    amount: -100000,
    balanceBefore: 900000,
    balanceAfter: 800000,
    date: "2025-09-15",
  },
  {
    id: "TXN006",
    type: "Nạp tiền",
    amount: 200000,
    balanceBefore: 800000,
    balanceAfter: 1000000,
    date: "2025-09-18",
  },
  // Tháng 10
  {
    id: "TXN007",
    type: "Nạp tiền",
    amount: 1500000,
    balanceBefore: 1000000,
    balanceAfter: 2500000,
    date: "2025-10-02",
  },
  {
    id: "TXN008",
    type: "Thanh toán Premium",
    amount: -500000,
    balanceBefore: 2500000,
    balanceAfter: 2000000,
    date: "2025-10-10",
  },
  {
    id: "TXN009",
    type: "Thanh toán Standard",
    amount: -300000,
    balanceBefore: 2000000,
    balanceAfter: 1700000,
    date: "2025-10-15",
  },
  {
    id: "TXN010",
    type: "Nạp tiền",
    amount: 400000,
    balanceBefore: 1700000,
    balanceAfter: 2100000,
    date: "2025-10-20",
  },
];

// Lấy danh sách tháng từ dữ liệu
const months = Array.from(
  new Set(transactions.map((txn) => txn.date.slice(0, 7)))
);

// Line chart data theo tháng
const generateLineChartData = (month) => {
  const monthTxns = transactions.filter((txn) => txn.date.startsWith(month));
  return monthTxns.map((txn) => ({
    date: txn.date.slice(5),
    balance: txn.balanceAfter,
  }));
};

const BalanceLineChart = memo(({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(v) => v.toLocaleString("vi-VN") + " ₫"} />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="#009ba1"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          isAnimationActive={false} // tắt animation nếu muốn mượt
        />
      </LineChart>
    </ResponsiveContainer>
  );
});

// ===================== Component =====================
function UserWallet() {
  const [filterType, setFilterType] = useState("all"); // all | deposit | payment
  const [filterMonth, setFilterMonth] = useState(months[0]); // default tháng đầu tiên
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dataUser, setDataUser] = useState({});

  useEffect(() => {
    const getDataUser = async () => {
      try {
        const url = "/account/get-info";
        const response_data = await fetchApi(url, {
          method: "get",
          skipAuth: false,
        });

        if (response_data.success) {
          setDataUser(response_data.data);
          return;
        }
      } catch (err) {
        console.log(err);
        return;
      }
    };
    getDataUser();
  }, []);

  // Filter cho bảng
  const filteredTransactions = transactions
    .filter((txn) => {
      if (fromDate && txn.date < fromDate) return false;
      if (toDate && txn.date > toDate) return false;
      return true;
    })
    .filter((txn) => {
      if (filterType === "all") return true;
      if (filterType === "deposit") return txn.type.includes("Nạp tiền");
      if (filterType === "payment") return txn.type.includes("Thanh toán");
      return true;
    });

  // Line chart vẫn theo filter tháng
  const lineData = generateLineChartData(filterMonth);

  const currentBalance =
    filteredTransactions.length > 0
      ? filteredTransactions[filteredTransactions.length - 1].balanceAfter
      : 0;

  return (
    <DashBoardUser>
      <div className={cx("user_wallet_container")}>
        <h1 className={cx("user_wallet_title")}>Quản lý tài chính</h1>
        {/* Số dư hiện tại */}
        <div className={cx("balance_wrapper")}>
          <h2 className={cx("balance_title")}>Thông tin số dư</h2>
          <div className={cx("balance_item")}>
            <div className={cx("balance_item_name")}>Chủ tài khoản</div>
            <div className={cx("balance_item_content")}>
              {dataUser?.fullname}
            </div>
          </div>
          <div className={cx("balance_item")}>
            <div className={cx("balance_item_name")}>Số dư khả dụng</div>
            <div className={cx("balance_item_content")}>
              {(dataUser?.wallet ?? 0).toLocaleString("vi-VN")} VNĐ
            </div>
          </div>
        </div>

        {/* Filter chọn tháng cho biểu đồ */}
        <div className={cx("month_filter")}>
          <label className={cx("month_choosing")}>Bộ lọc thời gian</label>
          <select
            className={cx("select_month")}
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month} value={month} className={cx("option_month")}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Biểu đồ line chart số dư trong tháng */}
        <div className={cx("line_chart_container")}>
          <h2 className={cx("balance_title")}>
            Biến động số dư tháng {filterMonth}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={lineData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value) => value.toLocaleString("vi-VN") + " ₫"}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#009ba1"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bảng thống kê giao dịch */}
        <div className={cx("transaction_table_container")}>
          <h2 className={cx("balance_title")}>Lịch sử giao dịch</h2>
          <div className={cx("transaction_filter")}>
            {/* Filter loại giao dịch */}
            <div className={cx("filter_buttons")}>
              <button className={filterType === "all" ? cx("active") : ""} onClick={() => setFilterType("all")} > Tất cả giao dịch</button>
              <button className={filterType === "deposit" ? cx("active") : ""} onClick={() => setFilterType("deposit")} > Lịch sử nạp </button>
              <button className={filterType === "payment" ? cx("active") : ""} onClick={() => setFilterType("payment")} > Lịch sử thanh toán </button>
            </div>
            {/* Filter từ ngày → đến ngày */}
            <div className={cx("date_filter")}>
              <label className={cx("label_day")}>Từ ngày: </label>
              <input className={cx("choosing_day")} type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              <label className={cx("label_day")}>Đến ngày: </label>
              <input className={cx("choosing_day")} type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              <button className={cx("btn_reset")} onClick={() => { setFromDate(""); setToDate(""); }} > Đặt lại </button>
            </div>
          </div>

          <table className={cx("transaction_table")}>
            <thead className={cx("header_table")}>
              <tr>
                <th>Mã giao dịch</th>
                <th>Số tiền</th>
                <th>Số dư đầu</th>
                <th>Số dư cuối</th>
                <th>Mô tả</th>
                <th>Thời điểm</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => (
                <tr key={txn.id}>
                  <td>{txn.id}</td>
                  <td className={cx("money_balance", {sub: txn.amount < 0}, {plus: txn.amount >= 0})}>{txn.amount.toLocaleString()}</td>
                  <td className={cx("money_balance")}>{txn.balanceBefore.toLocaleString()}</td>
                  <td className={cx("money_balance")}>{txn.balanceAfter.toLocaleString()}</td>
                  <td>{txn.type}</td>
                  <td>{txn.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashBoardUser>
  );
}

export default UserWallet;
