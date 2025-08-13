import fetchAPI from "./fetchApi";

const getCurrentUser = async () => {
  const key = import.meta.env.VITE_CURRENT_USER;

  try {
    const storedUser = localStorage.getItem(key);

    if (storedUser && storedUser !== "null" && storedUser !== "undefined") {
      console.log(">> Utils >> getUser >> current user (cached):", storedUser);
      return JSON.parse(storedUser);
    }

    const response_data = await fetchAPI("/account/me", {
      method: "get",
      body: null,
      params: null,
      skipAuth: false,
    });

    if (response_data?.success) {
      console.log(">> response:", response_data);
      localStorage.setItem(key, JSON.stringify(response_data.user));
      return response_data.user;
    }

    // Nếu không có user → xóa cache
    localStorage.removeItem(key);
    return null;

  } catch (error) {
    console.error("❌ Error getting current user:", error);
    localStorage.removeItem(key);
    return null;
  }
};

export default getCurrentUser;
