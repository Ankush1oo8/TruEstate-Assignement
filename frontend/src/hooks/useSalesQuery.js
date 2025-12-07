import { useEffect, useMemo, useState } from 'react';
import { fetchSales } from '../services/api';

const initialState = {
  data: [],
  total: 0,
  totalPages: 1,
  page: 1,
  pageSize: 10,
  summary: { totalUnits: 0, totalAmount: 0, totalDiscount: 0 }
};

export const useSalesQuery = (params) => {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const key = useMemo(() => JSON.stringify(params || {}), [params]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    fetchSales(params)
      .then((payload) => {
        if (active) setData(payload);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to fetch data');
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [key, params]);

  return { data, loading, error };
};
