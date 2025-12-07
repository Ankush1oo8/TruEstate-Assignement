const formatCurrency = (value) => {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    value
  );
};

const TransactionTable = ({ records }) => {
  if (!records.length) {
    return (
      <div className="surface table-card empty-state">
        <p>No results found. Try adjusting search, filters, or date range.</p>
      </div>
    );
  }

  return (
    <div className="surface table-card">
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Customer ID</th>
            <th>Customer name</th>
            <th>Phone Number</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Product Category</th>
            <th>Quantity</th>
            <th>Total Amount</th>
            <th>Customer region</th>
            <th>Product ID</th>
            <th>Employee name</th>
          </tr>
        </thead>
        <tbody>
          {records.map((row) => (
            <tr key={`${row.transactionId}-${row.date}`}>
              <td>{row.transactionId}</td>
              <td>{row.date || '—'}</td>
              <td>{row.customerId}</td>
              <td>{row.customerName}</td>
              <td>{row.phoneNumber}</td>
              <td>{row.gender}</td>
              <td>{row.age}</td>
              <td>{row.productCategory}</td>
              <td>{row.quantity?.toString().padStart(2, '0')}</td>
              <td>{formatCurrency(row.totalAmount)}</td>
              <td>{row.customerRegion}</td>
              <td>{row.productId}</td>
              <td>{row.employeeName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
