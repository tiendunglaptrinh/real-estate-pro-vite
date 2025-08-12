
import React, { useState, useEffect } from "react";

function TestUseEffect() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("useEffect chạy mỗi lần count thay đổi:", count);
    document.title = `Count: ${count}`;

    return () => {
      console.log("Cleanup trước khi effect chạy lần kế tiếp");
    };
  }, [count]);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Tăng Count</button>
    </div>
  );
}

export default TestUseEffect;