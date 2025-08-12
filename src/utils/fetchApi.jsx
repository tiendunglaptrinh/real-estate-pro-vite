import client from "../api/axiosInstance.jsx";

const fetchAPI = async (
  url,
  { method = "get", body = null, params = null, skipAuth = false } = {}
) => {
  try {
    const config = {
      url,
      method,
      params,
      skipAuth,
    };

    if (body) {
      config.data = body;
    }
    const response = await client(config);

    if (response.data && response.data.success === false) {
      throw new Error(response.data.message || "Unknown error from server");
    }

    return response.data;
  } catch (err) {
    throw err;
  } 
};

export default fetchAPI;
