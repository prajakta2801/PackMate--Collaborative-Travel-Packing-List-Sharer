import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import TipCard from '../../components/TipCard/TipCard';
import styles from './Profile.module.css';
import { api } from '../../utils/api';
import { toast } from 'sonner';
import CenteredSpinner from '../../components/centeredSpinner';

const Profile = ({ user, isAuthenticated }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(user);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', homeCity: user?.homeCity || '' });
  const [saved, setSaved] = useState(false);
  const [myTips, setMyTips] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tipsData, tripsData] = await Promise.all([api.getTips(), api.getMyTrips()]);
        setMyTips(tipsData.filter((t) => t.email === user.email));
        setTrips(tripsData);
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const activeTrips = trips.filter((t) => t.status === 'ongoing' || t.status === 'planning');

  const handleSave = async () => {
    try {
      const response = await api.updateMe(form);
      setUserInfo(response);
      setSaved(true);
      setEditing(false);
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      navigate('/');
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className={styles.page}>
        <div className={`${styles.inner} container`}>
          <p className={styles.notAuth}>Please sign in to view your profile.</p>
        </div>
      </main>
    );
  }

  if (loading) return <CenteredSpinner size="small" />;

  return (
    <main className={styles.page}>
      <div className={`${styles.inner} container`}>
        <header className={styles.header}>
          <div
            className={styles.avatar}
            aria-hidden="true"
          >
            {userInfo.name[0].toUpperCase()}
          </div>
          <div className={styles.info}>
            <h1 className={styles.name}>{userInfo.name}</h1>
            {userInfo.homeCity && (
              <p className={styles.email}>{userInfo.homeCity}</p>
            )}
            <p className={styles.email}>{userInfo.email}</p>
            <div className={styles.pills} aria-label="Profile statistics">
              <span className={styles.pill}>{trips.length} trips</span>
              <span className={`${styles.pill} ${styles.pillBlue}`}>
                {myTips.length} tips shared
              </span>
              <span className={`${styles.pill} ${styles.pillGreen}`}>
                {myTips.reduce((sum, t) => sum + (t.upvoteCount || 0), 0)} upvotes received
              </span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.editBtn}
              onClick={() => setEditing(!editing)}
              aria-expanded={editing}
              aria-controls="edit-profile-form"
              aria-label={editing ? 'Cancel editing profile' : 'Edit profile'}
            >
              {editing ? 'Cancel' : '✎ Edit'}
            </button>
            <button
              className={styles.logoutBtn}
              onClick={handleLogout}
              aria-label="Log out of your account"
            >
              Log out
            </button>
          </div>
        </header>

        {saved && (
          <div
            className={styles.savedBanner}
            role="status"
            aria-live="polite"
          >
            Profile updated
          </div>
        )}

        {editing && (
          <section
            id="edit-profile-form"
            className={styles.editCard}
            aria-labelledby="edit-profile-title"
          >
            <h2 id="edit-profile-title" className={styles.sectionTitle}>Edit profile</h2>
            <div className={styles.editRow}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="p-name">
                  Name
                </label>
                <input
                  id="p-name"
                  className={styles.input}
                  type="text"
                  value={form.name}
                  autoComplete="name"
                  aria-required="true"
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="p-city">
                  Home City
                </label>
                <input
                  id="p-city"
                  className={styles.input}
                  type="text"
                  value={form.homeCity}
                  autoComplete="address-level2"
                  onChange={(e) => setForm((p) => ({ ...p, homeCity: e.target.value }))}
                />
              </div>
            </div>
            <button
              className={styles.saveBtn}
              onClick={handleSave}
              aria-label="Save profile changes"
            >
              Save changes
            </button>
          </section>
        )}

        {activeTrips.length > 0 && (
          <section className={styles.section} aria-labelledby="active-trips-title">
            <h2 id="active-trips-title" className={styles.sectionTitle}>Currently packing for</h2>
            <ul className={styles.activeTripsGrid} aria-label="Active trips">
              {activeTrips.map((trip) => (
                <li key={trip._id} className={styles.activeTripCard}>
                  <span className={styles.activeTripIcon} aria-hidden="true">
                    {trip.climate === 'cold' ? '❄️' : trip.climate === 'tropical' ? '🌴' : '☀️'}
                  </span>
                  <div className={styles.activeTripInfo}>
                    <p className={styles.activeTripName}>{trip.tripName}</p>
                    <p className={styles.activeTripMeta}>
                      {trip.destination}
                      {trip.country ? `, ${trip.country}` : ''} · {trip.durationDays} days
                    </p>
                    <p className={styles.activeTripPacked}>
                      {trip.items.filter((i) => i.isChecked).length}/{trip.items.length} items
                      packed
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className={styles.section} aria-labelledby="my-tips-title">
          <h2 id="my-tips-title" className={styles.sectionTitle}>My submitted tips</h2>
          {myTips.length === 0 ? (
            <p className={styles.emptyText}>
              You haven&apos;t shared any tips yet. Complete a trip and share what you learned!
            </p>
          ) : (
            <div className={styles.tipsBox} role="list" aria-label="My submitted tips">
              {myTips.map((tip) => (
                <TipCard
                  key={tip._id}
                  tip={tip}
                  hasUpvoted={false}
                  onUpvote={() => {}}
                  onRemoveUpvote={() => {}}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

Profile.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    homeCity: PropTypes.string,
  }),
  isAuthenticated: PropTypes.bool.isRequired,
};
Profile.defaultProps = { user: null, isAuthenticated: false };

export default Profile;