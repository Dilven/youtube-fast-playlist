export const getQueryParams = (params: Record<string, any>) => {
  const queryParams = new URLSearchParams({});
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.set(key, value);
  });
  const queryParamsString = queryParams.toString();
  return queryParamsString.length > 0 ? `?${queryParamsString}` : "";
};
