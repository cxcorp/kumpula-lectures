export const ok = (data) => ({
  status: "ok",
  data,
});

export const error = (errorMsg) => ({
  status: "error",
  error: errorMsg,
});
