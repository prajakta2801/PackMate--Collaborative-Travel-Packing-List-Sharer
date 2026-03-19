<<<<<<< HEAD
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { tripTypes, climates } from '../../utils/mockData';
import { api } from '../../utils/api';
import TipCard from '../../components/TipCard/TipCard';
import FilterBar from '../../components/FilterBar/FilterBar';
=======
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { climates, tripTypes, luggageTypes, climateEmoji, typeEmoji } from '../../utils/mockData';
>>>>>>> 7f21d3227552bfd20d18074c7496a2d6c2538540
import styles from './Community.module.css';
import { api } from '../../utils/api';
import CenteredSpinner from '../../components/centeredSpinner';

const PAGE_SIZE = 12;
const STATUSES = ['planning', 'ongoing', 'completed'];
const statusColor = {
  planning: styles.badgePlanning,
  ongoing: styles.badgeOngoing,
  completed: styles.badgeCompleted,
};

<<<<<<< HEAD
const Community = ({ user, isAuthenticated }) => {
  const [tips, setTips] = useState([]);
  const [upvoted, setUpvoted] = useState([]);
  const [typeF, setTypeF] = useState([]);
  const [climateF, setClimateF] = useState([]);
  const [sort, setSort] = useState('Most upvoted');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    tripTypeTags: [],
    climateTags: [],
  });
  const [formErr, setFormErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const params = {};
        if (typeF.length === 1) params.tripType = typeF[0];
        const data = await api.getTips(params);
        setTips(data);
      } catch (err) {
        console.error('Failed to fetch tips', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, [typeF, climateF]);

  const visible = tips
    .filter((t) => {
      const mc =
        climateF.length === 0 ||
        (t.climateTags && t.climateTags.some((x) => climateF.includes(x)));
      return mc;
    })
    .sort((a, b) =>
      sort === 'Most upvoted'
        ? b.upvoteCount - a.upvoteCount
        : new Date(b.createdAt) - new Date(a.createdAt)
    );

  const handleUpvote = async (id) => {
    try {
      await api.upvoteTip(id);
      setUpvoted((p) => [...p, id]);
      setTips((p) =>
        p.map((t) => (t._id === id ? { ...t, upvoteCount: t.upvoteCount + 1 } : t))
      );
    } catch (err) {
      console.error('Failed to upvote', err);
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.removeUpvote(id);
      setUpvoted((p) => p.filter((u) => u !== id));
      setTips((p) =>
        p.map((t) => (t._id === id ? { ...t, upvoteCount: t.upvoteCount - 1 } : t))
      );
    } catch (err) {
      console.error('Failed to remove upvote', err);
    }
  };

  const toggleTag = (field, val) =>
    setForm((p) => ({
      ...p,
      [field]: p[field].includes(val)
        ? p[field].filter((v) => v !== val)
        : [...p[field], val],
    }));

  const submitTip = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      setFormErr('Title and description are required.');
      return;
    }
    if (form.tripTypeTags.length === 0) {
      setFormErr('Select at least one trip type.');
      return;
    }
    try {
      const newTip = await api.createTip({
        title: form.title,
        description: form.description,
        tripTypeTags: form.tripTypeTags,
        climateTags: form.climateTags,
      });
      setTips((p) => [newTip, ...p]);
      setForm({ title: '', description: '', tripTypeTags: [], climateTags: [] });
      setFormErr('');
      setShowForm(false);
    } catch (err) {
      setFormErr('Failed to post tip. Please try again.');
    }
  };

  if (loading) return <p>Loading tips...</p>;
=======
const Community = () => {
  const [trips, setTrips] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebounced] = useState('');
  const [status, setStatus] = useState('');
  const [climate, setClimate] = useState('');
  const [tripType, setTripType] = useState('');
  const [luggageType, setLuggageType] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: PAGE_SIZE };
      if (debouncedSearch) params.search = debouncedSearch;
      if (status) params.status = status;
      if (climate) params.climate = climate;
      if (tripType) params.tripType = tripType;
      if (luggageType) params.luggageType = luggageType;
      const data = await api.getTrips(params);
      setTrips(data.trips);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to fetch trips:', err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, status, climate, tripType, luggageType]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleFilter = (setter) => (val) => {
    setter(val);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch('');
    setStatus('');
    setClimate('');
    setTripType('');
    setLuggageType('');
    setPage(1);
  };

  const hasFilters = search || status || climate || tripType || luggageType;
>>>>>>> 7f21d3227552bfd20d18074c7496a2d6c2538540

  return (
    <div className={styles.page}>
      <div className={`${styles.inner} container`}>
        <div className={styles.pageHeader}>
          <div>
<<<<<<< HEAD
            <h1 className={styles.title}>Community Tips</h1>
            <p className={styles.sub}>
              Real advice from real travelers, ranked by usefulness.
            </p>
          </div>
          {isAuthenticated && user && (
            <button
              className={styles.shareBtn}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? '✕ Cancel' : '+ Share a tip'}
            </button>
          )}
        </div>

        {showForm && (
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Share your tip</h2>
            {formErr && <p className={styles.formErr}>{formErr}</p>}
            <div className={styles.formField}>
              <label className={styles.formLabel} htmlFor="tipTitle">
                Title
              </label>
              <input
                id="tipTitle"
                className={styles.formInput}
                type="text"
                placeholder="e.g. Roll, don't fold"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel} htmlFor="tipDesc">
                Description
              </label>
              <textarea
                id="tipDesc"
                className={styles.formTextarea}
                placeholder="Explain your tip in detail..."
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Trip types</label>
              <div className={styles.tagRow}>
                {tripTypes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`${styles.tagBtn} ${form.tripTypeTags.includes(t) ? styles.tagOn : ''}`}
                    onClick={() => toggleTag('tripTypeTags', t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>
                Climates{' '}
                <span className={styles.optional}>(optional)</span>
              </label>
              <div className={styles.tagRow}>
                {climates.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`${styles.tagBtn} ${form.climateTags.includes(c) ? styles.tagOn : ''}`}
                    onClick={() => toggleTag('climateTags', c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <button className={styles.postBtn} onClick={submitTip}>
              Post tip →
            </button>
          </div>
        )}

        <div className={styles.controls}>
          <div className={styles.filterGroup}>
            <FilterBar
              label="Type"
              filters={typeFilters}
              active={typeF}
              onChange={setTypeF}
            />
            <FilterBar
              label="Climate"
              filters={climateFilters}
              active={climateF}
              onChange={setClimateF}
            />
          </div>
          <div className={styles.sortGroup}>
            <span className={styles.sortLabel}>Sort</span>
            {SORTS.map((s) => (
              <button
                key={s}
                className={`${styles.sortBtn} ${sort === s ? styles.sortOn : ''}`}
                onClick={() => setSort(s)}
              >
                {s}
=======
            <h1 className={styles.title}>Community</h1>
            <p className={styles.sub}>
              Browse trips from travellers around the world, see their packing lists and tips.
            </p>
          </div>
          <span className={styles.totalBadge}>{total} trips</span>
        </div>

        <div className={styles.toolbar}>
          <input
            className={styles.search}
            type="text"
            placeholder="Search by trip name or destination..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <div className={styles.filters}>
            <select
              className={styles.select}
              value={status}
              onChange={(e) => handleFilter(setStatus)(e.target.value)}
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <select
              className={styles.select}
              value={climate}
              onChange={(e) => handleFilter(setClimate)(e.target.value)}
            >
              <option value="">All climates</option>
              {climates.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
            <select
              className={styles.select}
              value={tripType}
              onChange={(e) => handleFilter(setTripType)(e.target.value)}
            >
              <option value="">All trip types</option>
              {tripTypes.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
            <select
              className={styles.select}
              value={luggageType}
              onChange={(e) => handleFilter(setLuggageType)(e.target.value)}
            >
              <option value="">All luggage</option>
              {luggageTypes.map((l) => (
                <option key={l} value={l}>
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </option>
              ))}
            </select>
            {hasFilters && (
              <button className={styles.clearBtn} onClick={resetFilters}>
                Clear filters
>>>>>>> 7f21d3227552bfd20d18074c7496a2d6c2538540
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <CenteredSpinner size="small" />
        ) : trips.length === 0 ? (
          <div className={styles.empty}>
<<<<<<< HEAD
            <p className={styles.emptyTitle}>No tips match your filters.</p>
            <p className={styles.emptySub}>
              Try clearing some filters or share the first one!
            </p>
=======
            <p className={styles.emptyTitle}>No trips found.</p>
            <p className={styles.emptySub}>Try adjusting your filters or search term.</p>
            {hasFilters && (
              <button className={styles.clearBtn} onClick={resetFilters}>
                Clear filters
              </button>
            )}
>>>>>>> 7f21d3227552bfd20d18074c7496a2d6c2538540
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {trips.map((trip) => (
                <Link key={trip._id} to={`/community/${trip._id}`} className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={styles.cardIcon}>{climateEmoji[trip.climate] || '✈️'}</span>
                    <span className={`${styles.badge} ${statusColor[trip.status] || ''}`}>
                      {trip.status}
                    </span>
                  </div>
                  <h3 className={styles.cardName}>{trip.tripName}</h3>
                  <p className={styles.cardMeta}>
                    {trip.destination}
                    {trip.country ? `, ${trip.country}` : ''}
                  </p>
                  <div className={styles.cardTags}>
                    <span className={styles.tag}>
                      {typeEmoji[trip.tripType]} {trip.tripType}
                    </span>
                    <span className={styles.tag}>{trip.durationDays}d</span>
                    <span className={styles.tag}>{trip.luggageType}</span>
                  </div>
                  <div className={styles.cardFooter}>
                    <span className={styles.itemCount}>{trip.items.length} items</span>
                    <span className={styles.packed}>
                      {trip.items.filter((i) => i.isChecked).length}/{trip.items.length} packed
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← Prev
                </button>
                <div className={styles.pageNums}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === '...' ? (
                        <span key={`e${i}`} className={styles.ellipsis}>
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          className={`${styles.pageNum} ${page === p ? styles.pageNumOn : ''}`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      )
                    )}
                </div>
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

<<<<<<< HEAD
Community.propTypes = {
  user: PropTypes.shape({ _id: PropTypes.string, name: PropTypes.string }),
  isAuthenticated: PropTypes.bool.isRequired,
};
Community.defaultProps = { user: null, isAuthenticated: false };

export default Community;
=======
export default Community;
>>>>>>> 7f21d3227552bfd20d18074c7496a2d6c2538540
