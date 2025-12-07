let salesData = [];
let cachedOptions = null;
const PAGE_SIZE = 10;

const normalizeList = (value) => {
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

const toLowerSet = (list) => new Set(normalizeList(list).map((v) => v.toLowerCase()));

const safeNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const parseDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const setSalesData = (data) => {
  salesData = data;
  cachedOptions = null;
};

const getOptions = () => {
  if (cachedOptions) return cachedOptions;

  const sets = {
    regions: new Set(),
    genders: new Set(),
    productCategories: new Set(),
    tags: new Set(),
    paymentMethods: new Set()
  };

  let minAge = Infinity;
  let maxAge = -Infinity;
  let minDate = null;
  let maxDate = null;

  salesData.forEach((item) => {
    if (item.customerRegion) sets.regions.add(item.customerRegion);
    if (item.gender) sets.genders.add(item.gender);
    if (item.productCategory) sets.productCategories.add(item.productCategory);
    if (item.paymentMethod) sets.paymentMethods.add(item.paymentMethod);
    (item.tags || []).forEach((tag) => sets.tags.add(tag));

    if (typeof item.age === 'number') {
      minAge = Math.min(minAge, item.age);
      maxAge = Math.max(maxAge, item.age);
    }

    if (item.date) {
      const d = parseDate(item.date);
      if (d) {
        minDate = !minDate || d < minDate ? d : minDate;
        maxDate = !maxDate || d > maxDate ? d : maxDate;
      }
    }
  });

  cachedOptions = {
    regions: Array.from(sets.regions).sort(),
    genders: Array.from(sets.genders).sort(),
    productCategories: Array.from(sets.productCategories).sort(),
    tags: Array.from(sets.tags).sort(),
    paymentMethods: Array.from(sets.paymentMethods).sort(),
    ageRange:
      Number.isFinite(minAge) && Number.isFinite(maxAge)
        ? { min: minAge, max: maxAge }
        : { min: null, max: null },
    dateRange: {
      min: minDate ? minDate.toISOString().slice(0, 10) : null,
      max: maxDate ? maxDate.toISOString().slice(0, 10) : null
    }
  };

  return cachedOptions;
};

const querySales = (params = {}) => {
  const {
    searchTerm = '',
    customerRegions,
    genders,
    productCategories,
    tags,
    paymentMethods,
    ageMin,
    ageMax,
    dateFrom,
    dateTo,
    sortBy = 'date',
    sortOrder,
    page = 1
  } = params;

  const regionSet = toLowerSet(customerRegions);
  const genderSet = toLowerSet(genders);
  const categorySet = toLowerSet(productCategories);
  const tagSet = toLowerSet(tags);
  const paymentSet = toLowerSet(paymentMethods);

  const query = searchTerm.trim().toLowerCase();

  let minAge = safeNumber(ageMin);
  let maxAge = safeNumber(ageMax);
  if (minAge !== null && maxAge !== null && minAge > maxAge) {
    [minAge, maxAge] = [maxAge, minAge];
  }

  let startDate = parseDate(dateFrom);
  let endDate = parseDate(dateTo);
  if (startDate && endDate && startDate > endDate) {
    [startDate, endDate] = [endDate, startDate];
  }

  const filtered = salesData.filter((item) => {
    if (query) {
      const nameHit = (item.customerName || '').toLowerCase().includes(query);
      const phoneHit = (item.phoneNumber || '').toLowerCase().includes(query);
      if (!nameHit && !phoneHit) return false;
    }

    if (regionSet.size && !regionSet.has((item.customerRegion || '').toLowerCase())) return false;
    if (genderSet.size && !genderSet.has((item.gender || '').toLowerCase())) return false;
    if (categorySet.size && !categorySet.has((item.productCategory || '').toLowerCase())) return false;
    if (paymentSet.size && !paymentSet.has((item.paymentMethod || '').toLowerCase())) return false;

    if (tagSet.size) {
      const itemTags = (item.tags || []).map((t) => t.toLowerCase());
      const hasMatch = itemTags.some((t) => tagSet.has(t));
      if (!hasMatch) return false;
    }

    if (minAge !== null || maxAge !== null) {
      const ageValue = typeof item.age === 'number' ? item.age : null;
      if (ageValue === null) return false;
      if (minAge !== null && ageValue < minAge) return false;
      if (maxAge !== null && ageValue > maxAge) return false;
    }

    if (startDate || endDate) {
      const rowDate = parseDate(item.date);
      if (!rowDate) return false;
      if (startDate && rowDate < startDate) return false;
      if (endDate && rowDate > endDate) return false;
    }

    return true;
  });

  const effectiveSort =
    sortBy === 'quantity' || sortBy === 'customerName' || sortBy === 'date' ? sortBy : 'date';

  const resolvedOrder =
    sortOrder || (effectiveSort === 'customerName' ? 'asc' : 'desc');

  const sorted = [...filtered].sort((a, b) => {
    if (effectiveSort === 'customerName') {
      return resolvedOrder === 'asc'
        ? (a.customerName || '').localeCompare(b.customerName || '')
        : (b.customerName || '').localeCompare(a.customerName || '');
    }

    if (effectiveSort === 'quantity') {
      return resolvedOrder === 'asc'
        ? (a.quantity || 0) - (b.quantity || 0)
        : (b.quantity || 0) - (a.quantity || 0);
    }

    const aDate = parseDate(a.date);
    const bDate = parseDate(b.date);
    const aTime = aDate ? aDate.getTime() : 0;
    const bTime = bDate ? bDate.getTime() : 0;
    return resolvedOrder === 'asc' ? aTime - bTime : bTime - aTime;
  });

  const safePage = Math.max(1, Number(page) || 1);
  const safeSize = PAGE_SIZE;
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / safeSize));
  const offset = (safePage - 1) * safeSize;
  const data = sorted.slice(offset, offset + safeSize);

  const summary = sorted.reduce(
    (acc, item) => {
      acc.totalUnits += Number.isFinite(item.quantity) ? item.quantity : 0;
      acc.totalAmount += Number.isFinite(item.totalAmount) ? item.totalAmount : 0;
      const discount =
        Number.isFinite(item.totalAmount) && Number.isFinite(item.finalAmount)
          ? item.totalAmount - item.finalAmount
          : 0;
      acc.totalDiscount += discount;
      return acc;
    },
    { totalUnits: 0, totalAmount: 0, totalDiscount: 0 }
  );

  return {
    data,
    page: safePage,
    pageSize: safeSize,
    total,
    totalPages,
    summary
  };
};

module.exports = {
  setSalesData,
  getOptions,
  querySales
};
