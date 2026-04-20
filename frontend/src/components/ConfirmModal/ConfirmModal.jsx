import PropTypes from 'prop-types';
import styles from './ConfirmModal.module.css';

const ConfirmModal = ({ title, message, confirmLabel, onConfirm, onCancel, danger }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleOverlayClick}
      onKeyDown={(e) => e.key === 'Escape' && onCancel()}
    >
      <div className={styles.modal}>
        <h2 className={styles.title} id="modal-title">
          {title}
        </h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={`${styles.confirmBtn} ${danger ? styles.confirmDanger : styles.confirmPrimary}`}
            onClick={onConfirm}
            autoFocus
          >
            {confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  danger: PropTypes.bool,
};
ConfirmModal.defaultProps = { confirmLabel: 'Confirm', danger: false };

export default ConfirmModal;
