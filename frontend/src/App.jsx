import { useEffect, useMemo, useState } from 'react';
import Filters from './components/Filters';
import Pagination from './components/Pagination';
import SearchBar from './components/SearchBar';
import SortDropdown from './components/SortDropdown';
import SummaryCards from './components/SummaryCards';
import TransactionTable from './components/TransactionTable';
import { useSalesQuery } from './hooks/useSalesQuery';
import { fetchOptions } from './services/api';

const PAGE_SIZE = 10;

const defaultFilters = {
  regions: [],
  genders: [],
  productCategories: [],
  tags: [],
  paymentMethods: [],
  age: { min: '', max: '' },
  dateRange: { from: '', to: '' }
};

const App = () => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [sort, setSort] = useState({ sortBy: 'date', sortOrder: 'desc' });
  const [page, setPage] = useState(1);
  const [options, setOptions] = useState(null);
  const [optionsError, setOptionsError] = useState('');

  useEffect(() => {
    fetchOptions()
      .then((data) => setOptions(data))
      .catch((err) => setOptionsError(err.message || 'Unable to load filters'));
  }, []);

  const queryParams = useMemo(
    () => ({
      search,
      customerRegion: filters.regions,
      gender: filters.genders,
      productCategory: filters.productCategories,
      tags: filters.tags,
      paymentMethod: filters.paymentMethods,
      ageMin: filters.age.min,
      ageMax: filters.age.max,
      dateFrom: filters.dateRange.from,
      dateTo: filters.dateRange.to,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
      page,
      pageSize: PAGE_SIZE
    }),
    [search, filters, sort, page]
  );

  const { data, loading, error } = useSalesQuery(queryParams);

  const resetFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  return (
    <div className="app-shell">
      <div className="topbar">
        <div>
          <div className="title">Sales Management System</div>
          <div className="subtitle">Search, filter, sort, and paginate the retail dataset.</div>
        </div>
        <div className="controls">
          <SearchBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />
          <SortDropdown
            current={sort}
            onChange={(nextSort) => {
              setSort(nextSort);
              setPage(1);
            }}
          />
        </div>
      </div>

      {optionsError && (
        <div className="surface" style={{ padding: 12, color: '#b91c1c' }}>
          {optionsError}
        </div>
      )}

      <Filters
        options={options}
        filters={filters}
        onChange={(next) => {
          setFilters(next);
          setPage(1);
        }}
        onReset={resetFilters}
      />

      {!loading && !error && <SummaryCards summary={data.summary} />}

      {loading ? (
        <div className="surface table-card empty-state">Loading results…</div>
      ) : error ? (
        <div className="surface table-card empty-state" style={{ color: '#b91c1c' }}>
          {error}
        </div>
      ) : (
        <>
          <TransactionTable records={data.data} />
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default App;
