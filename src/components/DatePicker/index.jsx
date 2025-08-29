import React, { useState } from 'react';
import { DatePicker } from 'antd';
import 'antd/dist/reset.css';  // Dùng Ant Design v5

const CustomDatePicker = () => {
  const [date, setDate] = useState(null);

  return (
    <DatePicker
      value={date}
      onChange={(date) => setDate(date)}
      placement="bottom"
      format="DD/MM/YYYY"
      placeholder="Chọn ngày"
    //   id="date-picker"
      style={{
        width: '200px',
        padding: '8px',
        borderRadius: '8px',
      }}
    />
  );
};

export default CustomDatePicker;
