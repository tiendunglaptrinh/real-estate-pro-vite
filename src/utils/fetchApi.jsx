import client from "@api/axiosInstance.jsx";

const fetchApi = async (
  url,
  { method = "get", body = null, params = null, skipAuth = false } = {}
) => {
  try {
    const config = { url, method, params, skipAuth };

    if (body) config.data = body;

    const response = await client(config);

    return response.data;
  } catch (err) {
    if (err.response && err.response.data) {
      return err.response.data;
    }

    throw err;
  }
};

export default fetchApi;
