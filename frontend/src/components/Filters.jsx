const toggleValue = (list, value) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

const FilterDropdown = ({ label, children }) => (
  <details className="filter-chip" role="list">
    <summary>{label}</summary>
    <div className="chip-menu">{children}</div>
  </details>
);

const Filters = ({ options, filters, onChange, onReset }) => {
  const handleToggle = (key, value) => {
    onChange({ ...filters, [key]: toggleValue(filters[key], value) });
  };

  const handleRangeChange = (key, field, value) => {
    onChange({ ...filters, [key]: { ...filters[key], [field]: value } });
  };

  if (!options) {
    return (
      <div className="toolbar">
        <div className="muted">Loading filters…</div>
      </div>
    );
  }

  return (
    <div className="toolbar">
      <div className="filter-row">
        <FilterDropdown label="Customer Region">
          {options.regions.map((opt) => (
            <button
              key={opt}
              className={`chip ${filters.regions.includes(opt) ? 'active' : ''}`}
              type="button"
              onClick={() => handleToggle('regions', opt)}
            >
              {opt}
            </button>
          ))}
        </FilterDropdown>

        <FilterDropdown label="Gender">
          {options.genders.map((opt) => (
            <button
              key={opt}
              className={`chip ${filters.genders.includes(opt) ? 'active' : ''}`}
              type="button"
              onClick={() => handleToggle('genders', opt)}
            >
              {opt}
            </button>
          ))}
        </FilterDropdown>

        <FilterDropdown label="Age Range">
          <div className="input-row compact">
            <input
              type="number"
              placeholder={options.ageRange.min ?? 'Min'}
              value={filters.age.min}
              onChange={(e) => handleRangeChange('age', 'min', e.target.value)}
            />
            <input
              type="number"
              placeholder={options.ageRange.max ?? 'Max'}
              value={filters.age.max}
              onChange={(e) => handleRangeChange('age', 'max', e.target.value)}
            />
          </div>
        </FilterDropdown>

        <FilterDropdown label="Product Category">
          {options.productCategories.map((opt) => (
            <button
              key={opt}
              className={`chip ${filters.productCategories.includes(opt) ? 'active' : ''}`}
              type="button"
              onClick={() => handleToggle('productCategories', opt)}
            >
              {opt}
            </button>
          ))}
        </FilterDropdown>

        <FilterDropdown label="Tags">
          {options.tags.map((opt) => (
            <button
              key={opt}
              className={`chip ${filters.tags.includes(opt) ? 'active' : ''}`}
              type="button"
              onClick={() => handleToggle('tags', opt)}
            >
              {opt}
            </button>
          ))}
        </FilterDropdown>

        <FilterDropdown label="Payment Method">
          {options.paymentMethods.map((opt) => (
            <button
              key={opt}
              className={`chip ${filters.paymentMethods.includes(opt) ? 'active' : ''}`}
              type="button"
              onClick={() => handleToggle('paymentMethods', opt)}
            >
              {opt}
            </button>
          ))}
        </FilterDropdown>

        <FilterDropdown label="Date">
          <div className="input-row compact">
            <input
              type="date"
              value={filters.dateRange.from}
              min={options.dateRange.min || undefined}
              max={options.dateRange.max || undefined}
              onChange={(e) => handleRangeChange('dateRange', 'from', e.target.value)}
            />
            <input
              type="date"
              value={filters.dateRange.to}
              min={options.dateRange.min || undefined}
              max={options.dateRange.max || undefined}
              onChange={(e) => handleRangeChange('dateRange', 'to', e.target.value)}
            />
          </div>
        </FilterDropdown>
      </div>

      <button className="btn ghost" type="button" onClick={onReset}>
        Clear
      </button>
    </div>
  );
};

export default Filters;
