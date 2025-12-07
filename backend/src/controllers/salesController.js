const { querySales, getOptions } = require('../services/salesService');

const parseList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
};

const getSales = (req, res) => {
  const {
    search,
    customerRegion,
    gender,
    productCategory,
    tags,
    paymentMethod,
    ageMin,
    ageMax,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
    page
  } = req.query;

  const result = querySales({
    searchTerm: search,
    customerRegions: parseList(customerRegion),
    genders: parseList(gender),
    productCategories: parseList(productCategory),
    tags: parseList(tags),
    paymentMethods: parseList(paymentMethod),
    ageMin,
    ageMax,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
    page
  });

  res.json(result);
};

const getSalesOptions = (_req, res) => {
  res.json(getOptions());
};

module.exports = {
  getSales,
  getSalesOptions
};
