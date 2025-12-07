const sortOptions = [
  { label: 'Date (Newest first)', value: { sortBy: 'date', sortOrder: 'desc' } },
  { label: 'Quantity (High to Low)', value: { sortBy: 'quantity', sortOrder: 'desc' } },
  { label: 'Customer Name (A–Z)', value: { sortBy: 'customerName', sortOrder: 'asc' } }
];

const SortDropdown = ({ onChange, current }) => {
  const handleChange = (event) => {
    const selected = sortOptions[event.target.value];
    onChange(selected.value);
  };

  const selectedIndex = Math.max(
    0,
    sortOptions.findIndex(
      (opt) => opt.value.sortBy === current.sortBy && opt.value.sortOrder === current.sortOrder
    )
  );

  return (
    <select className="sort-select surface" value={selectedIndex} onChange={handleChange}>
      {sortOptions.map((opt, idx) => (
        <option key={opt.label} value={idx}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default SortDropdown;
