const Sale = require('../models/Sale');

const PAGE_SIZE = 10;

const getOptions = async () => {
  const [options] = await Sale.aggregate([
    {
      $facet: {
        regions: [{ $group: { _id: '$customerRegion' } }, { $sort: { _id: 1 } }],
        genders: [{ $group: { _id: '$gender' } }, { $sort: { _id: 1 } }],
        productCategories: [{ $group: { _id: '$productCategory' } }, { $sort: { _id: 1 } }],
        tags: [{ $unwind: '$tags' }, { $group: { _id: '$tags' } }, { $sort: { _id: 1 } }],
        paymentMethods: [{ $group: { _id: '$paymentMethod' } }, { $sort: { _id: 1 } }],
        ageRange: [{ $group: { _id: null, min: { $min: '$age' }, max: { $max: '$age' } } }],
        dateRange: [{ $group: { _id: null, min: { $min: '$date' }, max: { $max: '$date' } } }],
      },
    },
    {
      $project: {
        regions: '$regions._id',
        genders: '$genders._id',
        productCategories: '$productCategories._id',
        tags: '$tags._id',
        paymentMethods: '$paymentMethods._id',
        ageRange: {
          min: { $arrayElemAt: ['$ageRange.min', 0] },
          max: { $arrayElemAt: ['$ageRange.max', 0] },
        },
        dateRange: {
          min: { $dateToString: { format: '%Y-%m-%d', date: { $arrayElemAt: ['$dateRange.min', 0] } } },
          max: { $dateToString: { format: '%Y-%m-%d', date: { $arrayElemAt: ['$dateRange.max', 0] } } },
        },
      },
    },
  ]);
  return options;
};

const querySales = async (params = {}) => {
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
    page = 1,
  } = params;

  const match = {};

  if (searchTerm) {
    match.$or = [
      { customerName: { $regex: searchTerm, $options: 'i' } },
      { phoneNumber: { $regex: searchTerm, $options: 'i' } },
    ];
  }

  if (customerRegions && customerRegions.length) {
    match.customerRegion = { $in: customerRegions };
  }
  if (genders && genders.length) {
    match.gender = { $in: genders };
  }
  if (productCategories && productCategories.length) {
    match.productCategory = { $in: productCategories };
  }
  if (tags && tags.length) {
    match.tags = { $in: tags };
  }
  if (paymentMethods && paymentMethods.length) {
    match.paymentMethod = { $in: paymentMethods };
  }

  if (ageMin || ageMax) {
    match.age = {};
    if (ageMin) match.age.$gte = Number(ageMin);
    if (ageMax) match.age.$lte = Number(ageMax);
  }

  if (dateFrom || dateTo) {
    match.date = {};
    if (dateFrom) match.date.$gte = new Date(dateFrom);
    if (dateTo) match.date.$lte = new Date(dateTo);
  }

  const sort = {};
  const effectiveSort =
    sortBy === 'quantity' || sortBy === 'customerName' || sortBy === 'date' ? sortBy : 'date';
  const resolvedOrder = sortOrder === 'asc' ? 1 : -1;
  sort[effectiveSort] = resolvedOrder;

  const safePage = Math.max(1, Number(page) || 1);
  const offset = (safePage - 1) * PAGE_SIZE;

  const [results] = await Sale.aggregate([
    { $match: match },
    {
      $facet: {
        data: [{ $sort: sort }, { $skip: offset }, { $limit: PAGE_SIZE }],
        total: [{ $count: 'count' }],
        summary: [
          {
            $group: {
              _id: null,
              totalUnits: { $sum: '$quantity' },
              totalAmount: { $sum: '$totalAmount' },
              totalDiscount: { $sum: { $subtract: ['$totalAmount', '$finalAmount'] } },
            },
          },
        ],
      },
    },
  ]);

  const { data, total, summary } = results;
  const totalRecords = total.length > 0 ? total[0].count : 0;
  const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));
  const summaryData = summary.length > 0 ? summary[0] : { totalUnits: 0, totalAmount: 0, totalDiscount: 0 };


  return {
    data,
    page: safePage,
    pageSize: PAGE_SIZE,
    total: totalRecords,
    totalPages,
    summary: {
      totalUnits: summaryData.totalUnits,
      totalAmount: summaryData.totalAmount,
      totalDiscount: summaryData.totalDiscount,
    },
  };
};

module.exports = {
  getOptions,
  querySales,
};