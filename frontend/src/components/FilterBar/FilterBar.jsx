import PropTypes from 'prop-types';
import styles from './FilterBar.module.css';

const FilterBar = ({ label, filters, active, onChange }) => (
  <div className={styles.wrap} role="group" aria-label={label || 'Filters'}>
    {label && (
      <span className={styles.label} id={`filterbar-${label}`}>
        {label}
      </span>
    )}
    <div
      className={styles.pills}
      role="group"
      aria-labelledby={label ? `filterbar-${label}` : undefined}
    >
      <button
        className={`${styles.pill} ${active.length === 0 ? styles.pillOn : ''}`}
        onClick={() => onChange([])}
        aria-pressed={active.length === 0}
      >
        All
      </button>
      {filters.map((f) => (
        <button
          key={f.value}
          className={`${styles.pill} ${active.includes(f.value) ? styles.pillOn : ''}`}
          onClick={() => {
            if (active.includes(f.value)) onChange(active.filter((v) => v !== f.value));
            else onChange([...active, f.value]);
          }}
          aria-pressed={active.includes(f.value)}
        >
          {f.icon && <span aria-hidden="true">{f.icon} </span>}
          {f.label}
        </button>
      ))}
    </div>
  </div>
);

FilterBar.propTypes = {
  label: PropTypes.string,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
    })
  ).isRequired,
  active: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};
FilterBar.defaultProps = { label: '' };

export default FilterBar;
