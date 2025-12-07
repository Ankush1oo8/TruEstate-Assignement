const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const buildQuery = (params = {}) => {
  const searchParams = new URLSearchParams();
  const listFields = [
    'customerRegion',
    'gender',
    'productCategory',
    'tags',
    'paymentMethod'
  ];

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (listFields.includes(key)) {
      (Array.isArray(value) ? value : [value])
        .filter(Boolean)
        .forEach((v) => searchParams.append(key, v));
      return;
    }

    searchParams.set(key, value);
  });

  return searchParams.toString();
};

export const fetchSales = async (params) => {
  const query = buildQuery(params);
  const url = `${API_BASE}/sales${query ? `?${query}` : ''}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch sales data');
  }
  return response.json();
};

export const fetchOptions = async () => {
  const response = await fetch(`${API_BASE}/sales/options`);
  if (!response.ok) {
    throw new Error('Failed to load filter metadata');
  }
  return response.json();
};
