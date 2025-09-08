const formatUnitPrice = (unit_price) => {
  switch (unit_price) {
    case "million":
      return "Triệu đồng";

    case "billion":
      return "Tỷ đồng";
    case "million_per_month":
      return "Triệu đồng/tháng";

    case "million_per_m2":
      return "Triệu đồng/m²";

    default:
      return "Triệu đồng";
  }
};

export default formatUnitPrice;
