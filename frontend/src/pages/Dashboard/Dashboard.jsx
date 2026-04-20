import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TripCard from '../../components/TripCard/TripCard';
import styles from './Dashboard.module.css';
import { api } from '../../utils/api';
import CenteredSpinner from '../../components/centeredSpinner/index';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';

const TABS = ['all', 'planning', 'ongoing', 'completed'];

const Dashboard = ({ user, isAuthenticated }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');

  const fetchTrips = async () => {
    try {
      const data = await api.getMyTrips();
      setTrips(data);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await api.deleteTrip(deleteId);
      setTrips((p) => p.filter((t) => t._id !== deleteId));
      toast.success('Trip deleted');
    } catch (error) {
      console.error('Failed to delete trip:', error);
      toast.error('Failed to delete trip');
    } finally {
      setDeleteId(null);
    }
  };

  const counts = TABS.reduce((acc, t) => {
    acc[t] = t === 'all' ? trips.length : trips.filter((x) => x.status === t).length;
    return acc;
  }, {});

  const tabFiltered = tab === 'all' ? trips : trips.filter((t) => t.status === tab);

  const visibleTrips = search.trim()
    ? tabFiltered.filter(
        (t) =>
          t?.tripName?.toLowerCase().includes(search.toLowerCase()) ||
          t?.destination?.toLowerCase().includes(search.toLowerCase()) ||
          t?.country?.toLowerCase().includes(search.toLowerCase())
      )
    : tabFiltered;

  const handleTabKeyDown = (e, t) => {
    const idx = TABS.indexOf(t);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setTab(TABS[(idx + 1) % TABS.length]);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setTab(TABS[(idx - 1 + TABS.length) % TABS.length]);
    }
    if (e.key === 'Home') {
      e.preventDefault();
      setTab(TABS[0]);
    }
    if (e.key === 'End') {
      e.preventDefault();
      setTab(TABS[TABS.length - 1]);
    }
  };

  if (loading) return <CenteredSpinner size="small" />;

  return (
    <div className={styles.page}>
      <div className={`${styles.inner} container`}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>My Trips</h1>
            {isAuthenticated && (
              <p className={styles.sub}>Welcome back, {user.name.split(' ')[0]}</p>
            )}
          </div>
          <Link to="/create-trip" className={styles.newBtn}>
            + New trip
          </Link>
        </div>

        <div className={styles.summary} aria-label="Trip summary">
          <div className={styles.summCard}>
            <span className={styles.summN}>{trips.length}</span>
            <span className={styles.summL}>Total</span>
          </div>
          <div className={styles.summCard}>
            <span className={`${styles.summN} ${styles.summBlue}`}>{counts.planning}</span>
            <span className={styles.summL}>Planning</span>
          </div>
          <div className={styles.summCard}>
            <span className={`${styles.summN} ${styles.summAmber}`}>{counts.ongoing}</span>
            <span className={styles.summL}>Ongoing</span>
          </div>
          <div className={styles.summCard}>
            <span className={`${styles.summN} ${styles.summGreen}`}>{counts.completed}</span>
            <span className={styles.summL}>Completed</span>
          </div>
        </div>

        {/* ── Search ── */}
        <div className={styles.searchRow}>
          <input
            className={styles.search}
            type="text"
            placeholder="Search trips by name, destination or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search your trips"
          />
          {search && (
            <button
              className={styles.clearSearch}
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.tabs} role="tablist" aria-label="Filter trips by status">
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              className={`${styles.tab} ${tab === t ? styles.tabOn : ''}`}
              onClick={() => setTab(t)}
              onKeyDown={(e) => handleTabKeyDown(e, t)}
              aria-selected={tab === t}
              tabIndex={tab === t ? 0 : -1}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              <span className={styles.tabCount} aria-hidden="true">
                {counts[t]}
              </span>
            </button>
          ))}
        </div>

        {visibleTrips.length > 0 ? (
          <div className={styles.list} role="list" aria-label="Trips">
            {visibleTrips.map((trip, i) => (
              <TripCard key={trip._id} trip={trip} index={i} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className={styles.empty} role="status">
            <p className={styles.emptyTitle}>
              {search
                ? `No trips matching "${search}"`
                : tab === 'all'
                  ? 'No trips here yet.'
                  : `No ${tab} trips.`}
            </p>
            <p className={styles.emptySub}>
              {search
                ? 'Try a different search term or clear the filter.'
                : tab === 'all'
                  ? 'Create your first trip to start building a packing list.'
                  : `You have no trips with status "${tab}".`}
            </p>
            {search && (
              <button
                className={styles.emptyBtn}
                style={{ marginTop: 16 }}
                onClick={() => setSearch('')}
              >
                Clear search
              </button>
            )}
            {!search && tab === 'all' && (
              <Link to="/create-trip" className={styles.emptyBtn} style={{ marginTop: 16 }}>
                + New trip
              </Link>
            )}
          </div>
        )}
      </div>

      {deleteId && (
        <ConfirmModal
          title="Delete this trip?"
          message="This trip and all its packing items will be permanently deleted. This cannot be undone."
          confirmLabel="Delete trip"
          danger
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
};

Dashboard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    homeCity: PropTypes.string,
  }),
  isAuthenticated: PropTypes.bool.isRequired,
};
Dashboard.defaultProps = { user: null, isAuthenticated: false };

export default Dashboard;
