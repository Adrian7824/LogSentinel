type PaginationProps = {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  if (totalItems === 0) return null

  const firstItem = (currentPage - 1) * pageSize + 1
  const lastItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-[11px] text-slate-400">
        Mostrando <span className="font-semibold text-slate-600">{firstItem}–{lastItem}</span> de{' '}
        <span className="font-semibold text-slate-600">{totalItems}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          type="button"
        >
          Anterior
        </button>
        <span className="min-w-20 text-center text-[11px] font-medium text-slate-500">
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          type="button"
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
