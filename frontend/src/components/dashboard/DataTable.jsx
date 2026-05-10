export const DataTable = ({ columns, rows, emptyMessage = 'No records found.' }) => (
  <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
    <table className="min-w-full divide-y divide-white/10">
      <thead className="bg-white/5">
        <tr>
          {columns.map((column) => (
            <th key={column.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-white/10">
        {rows.length ? (
          rows.map((row, index) => (
            <tr key={row.id || index} className="hover:bg-white/5">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-4 text-sm text-slate-200">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td className="px-4 py-8 text-center text-slate-400" colSpan={columns.length}>
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);