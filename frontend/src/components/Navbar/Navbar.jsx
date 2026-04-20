import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './Navbar.module.css';
import { api } from '../../utils/api';
import { toast } from 'sonner';

const Navbar = ({ user, isAuthenticated }) => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const active = (p) => pathname === p;

  const handleLogout = async () => {
    try {
      await api.logout();
      navigate('/');
      setOpen(false);
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
      console.error('Logout failed:', error);
    }
  };

  const handleNavKeyDown = (e) => {
    if (e.key === 'Escape' && open) setOpen(false);
  };

  return (
    <nav className={styles.nav} onKeyDown={handleNavKeyDown}>
      <div className={`${styles.inner} container`}>
        <Link to="/" className={styles.logo} aria-label="PackMate home">
          <span className={styles.logoDot} aria-hidden="true" />
          PackMate
        </Link>

        <div
          id="main-nav"
          className={`${styles.links} ${open ? styles.linksOpen : ''}`}
          role="navigation"
          aria-label="Main navigation"
        >
          <Link
            to="/dashboard"
            className={`${styles.link} ${active('/dashboard') ? styles.linkActive : ''}`}
            onClick={() => setOpen(false)}
            aria-current={active('/dashboard') ? 'page' : undefined}
          >
            My Trips
          </Link>
          <Link
            to="/community"
            className={`${styles.link} ${active('/community') ? styles.linkActive : ''}`}
            onClick={() => setOpen(false)}
            aria-current={active('/community') ? 'page' : undefined}
          >
            Community
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className={`${styles.link} ${active('/profile') ? styles.linkActive : ''}`}
                onClick={() => setOpen(false)}
                aria-current={active('/profile') ? 'page' : undefined}
              >
                {user?.name?.split(' ')[0]}
              </Link>
              <button className={styles.outlineBtn} onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={styles.link}
                onClick={() => setOpen(false)}
                aria-current={active('/login') ? 'page' : undefined}
              >
                Sign in
              </Link>
              <Link to="/register" className={styles.solidBtn} onClick={() => setOpen(false)}>
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          className={styles.burger}
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="main-nav"
        >
          <span className={`${styles.bar} ${open ? styles.bar1Open : ''}`} />
          <span className={`${styles.bar} ${open ? styles.bar2Open : ''}`} />
          <span className={`${styles.bar} ${open ? styles.bar3Open : ''}`} />
        </button>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  user: PropTypes.shape({ name: PropTypes.string }),
  isAuthenticated: PropTypes.bool.isRequired,
};
Navbar.defaultProps = { user: null, isAuthenticated: false };

export default Navbar;
