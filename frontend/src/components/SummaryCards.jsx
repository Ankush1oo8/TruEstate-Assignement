const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    Math.round(value || 0)
  );

const SummaryCards = ({ summary }) => {
  const items = [
    { label: 'Total units sold', value: summary.totalUnits },
    { label: 'Total Amount', value: formatCurrency(summary.totalAmount) },
    { label: 'Total Discount', value: formatCurrency(summary.totalDiscount) }
  ];

  return (
    <div className="summary-cards">
      {items.map((item) => (
        <div key={item.label} className="summary-card">
          <div className="summary-label">{item.label}</div>
          <div className="summary-value">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
