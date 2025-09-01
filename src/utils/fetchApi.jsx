import client from "@api/axiosInstance.jsx";

const fetchApi = async (
  url,
  { method = "get", body = null, params = null, skipAuth = false } = {}
) => {
  try {
    const config = { url, method, params, skipAuth };

    if (body) config.data = body;

    const response = await client(config);

    return response.data; // trả nguyên data luôn
  } catch (err) {
    // Nếu là lỗi axios (status >=400), lấy message từ response.data nếu có
    if (err.response && err.response.data) {
      return err.response.data; // FE sẽ check success/message
    }

    // Lỗi network/unexpected
    throw err;
  }
};

export default fetchApi;
