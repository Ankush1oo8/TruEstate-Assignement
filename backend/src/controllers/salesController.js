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

const getSales = async (req, res) => {
  try {
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
      page,
    } = req.query;

    const result = await querySales({
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
      page,
    });

    res.json(result);
  } catch (error) {
    console.error('Error in getSales:', error);
    res.status(500).json({ message: 'Error fetching sales data' });
  }
};

const getSalesOptions = async (_req, res) => {
  try {
    const options = await getOptions();
    res.json(options);
  } catch (error) {
    console.error('Error in getSalesOptions:', error);
    res.status(500).json({ message: 'Error fetching sales options' });
  }
};

module.exports = {
  getSales,
  getSalesOptions,
};
