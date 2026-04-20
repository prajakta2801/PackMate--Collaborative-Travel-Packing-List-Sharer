import PropTypes from 'prop-types';
import styles from './PackingItem.module.css';

const catIcon = {
  Clothing: '👕',
  Footwear: '👟',
  Electronics: '🔌',
  Toiletries: '🧴',
  Documents: '📄',
  'Health & Safety': '💊',
  'Activity Gear': '🎒',
};

const PackingItem = ({
  item,
  isChecked,
  isInTrip,
  onToggleCheck,
  onAddToTrip,
  onRemoveFromTrip,
}) => {
  const handleCheckKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggleCheck(item._id);
    }
  };

  return (
    <div className={`${styles.row} ${isChecked ? styles.checked : ''}`} role="listitem">
      {isInTrip && (
        <button
          className={`${styles.checkbox} ${isChecked ? styles.checkboxOn : ''}`}
          onClick={() => onToggleCheck(item._id)}
          onKeyDown={handleCheckKeyDown}
          role="checkbox"
          aria-checked={isChecked}
          aria-label={`${isChecked ? 'Unpack' : 'Pack'} ${item.name}`}
        >
          {isChecked && (
            <span className={styles.tick} aria-hidden="true">
              ✓
            </span>
          )}
        </button>
      )}

      <span className={styles.icon} aria-hidden="true">
        {catIcon[item.category] || '📦'}
      </span>

      <div className={styles.info}>
        <span className={styles.name}>{item.name}</span>
        <span className={styles.cat}>{item.category}</span>
      </div>

      {item.isEssential && (
        <span className={styles.essential} aria-label="Essential item">
          Essential
        </span>
      )}

      {isInTrip ? (
        <button
          className={styles.removeBtn}
          onClick={() => onRemoveFromTrip(item._id)}
          aria-label={`Remove ${item.name} from list`}
        >
          ✕
        </button>
      ) : (
        <button
          className={styles.addBtn}
          onClick={() => onAddToTrip(item)}
          aria-label={`Add ${item.name} to trip list`}
        >
          + Add
        </button>
      )}
    </div>
  );
};

PackingItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    isEssential: PropTypes.bool,
  }).isRequired,
  isChecked: PropTypes.bool,
  isInTrip: PropTypes.bool,
  onToggleCheck: PropTypes.func,
  onAddToTrip: PropTypes.func,
  onRemoveFromTrip: PropTypes.func,
};
PackingItem.defaultProps = {
  isChecked: false,
  isInTrip: false,
  onToggleCheck: () => {},
  onAddToTrip: () => {},
  onRemoveFromTrip: () => {},
};

export default PackingItem;
