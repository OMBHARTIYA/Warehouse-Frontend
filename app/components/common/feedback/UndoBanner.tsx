type UndoBannerProps = {
  message: string;
  onUndo: () => void;
};

export default function UndoBanner({ message, onUndo }: UndoBannerProps) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      {message}
      <button type="button" className="ml-2 rounded bg-emerald-700 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-800" onClick={onUndo}>
        Undo
      </button>
    </div>
  );
}
