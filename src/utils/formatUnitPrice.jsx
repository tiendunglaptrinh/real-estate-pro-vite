const formatUnitPrice = (unit_price) => {
  switch (unit_price) {
    case "million":
      return "Triệu VND";
    case "tens_milion":
      return "Chục triệu VND";
    case "hundreds_milion":
      return "Trăm triệu VND";
    case "bilion":
      return "Tỷ VND";
    case "milion_per_month":
      return "Triệu VND/tháng";
    case "tens_milion_per_month":
      return "Chục triệu VND/tháng";
    case "hundreds_milion_per_month":
      return "Trăm triệu VND/tháng";
    case "milion_per_m2":
      return "Triệu VND/m²";
    case "tens_milion_per_m2":
      return "Chục triệu VND/m²";
    case "hundreds_milion_per_m2":
      return "Trăm triệu VND/m²";
    default:
      return "Không xác định";
  }
};

export default formatUnitPrice;
