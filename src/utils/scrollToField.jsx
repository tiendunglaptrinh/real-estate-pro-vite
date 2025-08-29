const scrollToField = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({
      behavior: "smooth", // Cuộn mượt
      block: "center"     // Giữa màn hình
    });
    if (el.focus) el.focus(); // Focus vào input nếu có
    // if (el.tagName === "SELECT") {
    //   setTimeout(() => {
    //     el.click();
    //   }, 300); // Delay tí để cuộn xong mới click
    // }
  }
};

export default scrollToField;