import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import { api } from '../../utils/api';
import { toast } from 'sonner';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    homeCity: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    if (!form.homeCity.trim()) e.homeCity = 'Required';
    if (form.password.length < 6) e.password = 'Min. 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    try {
      setLoading(true);
      await api.register(form);
      navigate('/login');
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Registration failed:', error);
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.brand} aria-label="PackMate">
          <span className={styles.brandDot} aria-hidden="true" />
          PackMate
        </div>

        <section className={styles.card} aria-labelledby="register-title">
          <h1 id="register-title" className={styles.title}>Create account</h1>
          <p className={styles.sub}>Free forever. Start packing smarter today.</p>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              aria-required="true"
              aria-describedby={errors.name ? 'name-error' : undefined}
              aria-invalid={!!errors.name}
              className={`${styles.input} ${errors.name ? styles.inputErr : ''}`}
              type="text"
              placeholder="Your Name"
              value={form.name}
              autoComplete="name"
              onChange={(e) => set('name', e.target.value)}
            />
            {errors.name && (
              <span id="name-error" className={styles.err} role="alert">
                {errors.name}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="homeCity">
              Home City
            </label>
            <input
              id="homeCity"
              aria-required="true"
              aria-describedby={errors.homeCity ? 'homeCity-error' : undefined}
              aria-invalid={!!errors.homeCity}
              className={`${styles.input} ${errors.homeCity ? styles.inputErr : ''}`}
              type="text"
              placeholder="New York"
              value={form.homeCity}
              autoComplete="address-level2"
              onChange={(e) => set('homeCity', e.target.value)}
            />
            {errors.homeCity && (
              <span id="homeCity-error" className={styles.err} role="alert">
                {errors.homeCity}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reg-email">
              Email
            </label>
            <input
              id="reg-email"
              aria-required="true"
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={!!errors.email}
              className={`${styles.input} ${errors.email ? styles.inputErr : ''}`}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              autoComplete="email"
              onChange={(e) => set('email', e.target.value)}
            />
            {errors.email && (
              <span id="email-error" className={styles.err} role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reg-password">
              Password
            </label>
            <input
              id="reg-password"
              aria-required="true"
              aria-describedby={errors.password ? 'password-error' : undefined}
              aria-invalid={!!errors.password}
              className={`${styles.input} ${errors.password ? styles.inputErr : ''}`}
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              autoComplete="new-password"
              onChange={(e) => set('password', e.target.value)}
            />
            {errors.password && (
              <span id="password-error" className={styles.err} role="alert">
                {errors.password}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="confirm">
              Confirm password
            </label>
            <input
              id="confirm"
              aria-required="true"
              aria-describedby={errors.confirm ? 'confirm-error' : undefined}
              aria-invalid={!!errors.confirm}
              className={`${styles.input} ${errors.confirm ? styles.inputErr : ''}`}
              type="password"
              placeholder="Repeat password"
              value={form.confirm}
              autoComplete="new-password"
              onChange={(e) => set('confirm', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
            {errors.confirm && (
              <span id="confirm-error" className={styles.err} role="alert">
                {errors.confirm}
              </span>
            )}
          </div>

          <button
            className={styles.submitBtn}
            onClick={submit}
            disabled={loading}
            aria-busy={loading}
            aria-label={loading ? 'Creating account, please wait' : 'Create account'}
          >
            {loading ? 'Creating account...' : 'Create account →'}
          </button>

          <p className={styles.switchText}>
            Already have an account?{' '}
            <Link
              to="/login"
              className={styles.switchLink}
              aria-label="Sign in to your existing account"
            >
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default Register;