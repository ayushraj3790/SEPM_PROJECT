export const saveAuthData = (data) => {
  localStorage.setItem("auth", JSON.stringify(data));
};

export const getAuthData = () => {
  const raw = localStorage.getItem("auth");
  return raw ? JSON.parse(raw) : null;
};

export const clearAuthData = () => {
  localStorage.removeItem("auth");
};