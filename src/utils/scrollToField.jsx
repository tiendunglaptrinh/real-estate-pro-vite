const scrollToField = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({
      behavior: "smooth", // Cuộn mượt
      block: "center"     // Giữa màn hình
    });
    if (el.focus) el.focus();
  }
};

export default scrollToField;