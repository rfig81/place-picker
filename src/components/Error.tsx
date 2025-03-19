interface ErrorProps {
  title?: string;
  message: string;
  onConfirm?: () => void;
}

export default function Error({
  title = "An error occurred!",
  message,
  onConfirm,
}: ErrorProps) {
  return (
    <div className="error">
      <h2>{title}</h2>
      <p>{message}</p>
      {onConfirm && (
        <div id="confirmation-actions">
          <button onClick={onConfirm} className="button">
            Okay
          </button>
        </div>
      )}
    </div>
  );
}
