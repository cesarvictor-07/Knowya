import { useEffect, useRef } from "react";
import "../styles/feedback-modal.css";

function FeedbackModal({
  isOpen,
  type = "success",
  title,
  message,
  icon,
  buttonText = "Entendido",
  onClose,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (isOpen && dialog && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog?.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose?.();
  };

  const icons = {
    success: "✓",
    info: "i",
  };

  return (
    <dialog
      ref={dialogRef}
      className={`feedback-modal feedback-modal--${type}`}
      aria-labelledby="feedback-title"
      aria-describedby="feedback-description"
      onClose={handleClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          dialogRef.current.close();
        }
      }}
    >
      <div className="feedback-modal-content">

        <div className="feedback-modal-icon" aria-hidden="true">
          {icon || icons[type]}
        </div>

        <h2 id="feedback-title">{title}</h2>

        <p id="feedback-description">{message}</p>

        <button
          type="button"
          className="auth-button"
          onClick={() => dialogRef.current?.close()}
        >
          {buttonText}
        </button>

      </div>
    </dialog>
  );
}

export default FeedbackModal;
