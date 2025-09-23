const formatHiddenPhone = (phone) => {
  if (!phone) return "";

  const str = phone.toString();
  if (str.length <= 6) return str;

  const first = str.slice(0, 3);
  const last = str.slice(-3);
  const hidden = "*".repeat(str.length - 6);

  return `${first}${hidden}${last}`;
};

export default formatHiddenPhone;