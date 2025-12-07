const fs = require('fs');
const { parse } = require('csv-parse/sync');

const numberFields = new Set([
  'Age',
  'Quantity',
  'Price per Unit',
  'Discount Percentage',
  'Total Amount',
  'Final Amount'
]);

const parseNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const parseDateValue = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
};

const formatRow = (row) => {
  const tags = row['Tags']
    ? row['Tags']
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const record = {};
  Object.entries(row).forEach(([key, rawValue]) => {
    if (numberFields.has(key)) {
      record[key] = parseNumber(rawValue);
      return;
    }
    record[key] = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
  });

  return {
    transactionId: record['Transaction ID'],
    date: parseDateValue(record['Date']),
    customerId: record['Customer ID'],
    customerName: record['Customer Name'],
    phoneNumber: record['Phone Number'],
    gender: record['Gender'],
    age: record['Age'],
    customerRegion: record['Customer Region'],
    customerType: record['Customer Type'],
    productId: record['Product ID'],
    productName: record['Product Name'],
    brand: record['Brand'],
    productCategory: record['Product Category'],
    tags,
    quantity: record['Quantity'],
    pricePerUnit: record['Price per Unit'],
    discountPercentage: record['Discount Percentage'],
    totalAmount: record['Total Amount'],
    finalAmount: record['Final Amount'],
    paymentMethod: record['Payment Method'],
    orderStatus: record['Order Status'],
    deliveryType: record['Delivery Type'],
    storeId: record['Store ID'],
    storeLocation: record['Store Location'],
    salespersonId: record['Salesperson ID'],
    employeeName: record['Employee Name']
  };
};

const loadSalesData = (csvPath) => {
  const raw = fs.readFileSync(csvPath, 'utf-8');
  const parsed = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  return parsed.map(formatRow);
};

module.exports = { loadSalesData };
