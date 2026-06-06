import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  sortKey?: string;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchField?: keyof T | ((row: T) => string);
  emptyTitle?: string;
  emptyDescription?: string;
  actions?: React.ReactNode;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  searchPlaceholder = 'Search records...',
  searchField,
  emptyTitle,
  emptyDescription,
  actions,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter Data
  const filteredData = useMemo(() => {
    if (!searchTerm || !searchField) return data;

    return data.filter((row) => {
      let stringValue = '';
      if (typeof searchField === 'function') {
        stringValue = searchField(row);
      } else {
        const val = row[searchField];
        stringValue = val ? String(val) : '';
      }
      return stringValue.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm, searchField]);

  // Sort Data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      const { key } = sortConfig;
      // Resolve column accessor or sorting key
      const col = columns.find((c) => c.header === key || c.sortKey === key);
      if (col) {
        if (typeof col.accessor === 'function') {
          aVal = col.accessor(a);
          bVal = col.accessor(b);
        } else {
          aVal = a[col.accessor];
          bVal = b[col.accessor];
        }
      }

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return sorted;
  }, [filteredData, sortConfig, columns]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return sortedData.slice(startIdx, startIdx + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    let direction: 'asc' | 'desc' = 'asc';
    const key = typeof column.accessor === 'string' ? String(column.accessor) : column.header;

    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-xl border border-slate-100 shadow-premium overflow-hidden">
      {/* Search and Top Bar */}
      {(searchField || actions) && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-b border-slate-100 bg-slate-50/20">
          {searchField && (
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
              />
            </div>
          )}
          <div className="flex items-center gap-3 ml-auto w-full sm:w-auto justify-end">
            {actions}
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {columns.map((column, idx) => {
                const isSortable = column.sortable;
                const key = typeof column.accessor === 'string' ? String(column.accessor) : column.header;
                const isSorted = sortConfig?.key === key;

                return (
                  <th
                    key={idx}
                    onClick={() => isSortable && handleSort(column)}
                    className={`px-6 py-4.5 text-xs font-semibold text-slate-500 uppercase tracking-wider select-none ${
                      isSortable ? 'cursor-pointer hover:bg-slate-100/70' : ''
                    } ${column.className || ''}`}
                  >
                    <div className="flex items-center gap-1.5">
                      {column.header}
                      {isSortable && (
                        <div className="flex flex-col text-slate-400">
                          {isSorted && sortConfig?.direction === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5 text-primary" />
                          ) : isSorted && sortConfig?.direction === 'desc' ? (
                            <ChevronDown className="w-3.5 h-3.5 text-primary" />
                          ) : (
                            <div className="opacity-40 flex flex-col gap-0.5">
                              <ChevronUp className="w-3 h-3 -mb-1" />
                              <ChevronDown className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr key={row.id || rowIdx} className="hover:bg-slate-50/40 transition">
                  {columns.map((column, colIdx) => {
                    let cellContent: React.ReactNode;
                    if (typeof column.accessor === 'function') {
                      cellContent = column.accessor(row);
                    } else {
                      cellContent = row[column.accessor] as any;
                    }

                    return (
                      <td
                        key={colIdx}
                        className={`px-6 py-4 text-sm font-medium text-slate-700 ${column.className || ''}`}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10">
                  <EmptyState
                    title={emptyTitle || 'No Records Found'}
                    description={emptyDescription || 'There are no active entries matching this criteria.'}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

          {/* Pagination Bar */}
      {sortedData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4.5 border-t border-slate-100 bg-slate-50/20 text-slate-500 text-sm">
          <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start select-none w-full sm:w-auto">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2.5 py-1 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:border-primary"
            >
              {[5, 10, 25, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>entries</span>
            <span className="ml-0 sm:ml-4 font-normal text-xs text-slate-400 w-full sm:w-auto text-center sm:text-left mt-1 sm:mt-0">
              Showing {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)} to{' '}
              {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
            </span>
          </div>

          <div className="flex items-center gap-1.5 justify-center w-full sm:w-auto">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-slate-600 transition"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
            <div className="flex items-center gap-1 flex-wrap justify-center">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-lg transition ${
                      currentPage === pageNum
                        ? 'bg-primary text-white shadow-sm shadow-primary/20'
                        : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-slate-600 transition"
            >
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
