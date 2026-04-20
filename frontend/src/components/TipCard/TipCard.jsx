import PropTypes from 'prop-types';
import styles from './TipCard.module.css';

const tagColors = ['blue', 'green', 'amber'];

const TipCard = ({ tip, hasUpvoted, onUpvote, onRemoveUpvote, isOwner }) => {
  const handleVote = () => (hasUpvoted ? onRemoveUpvote(tip._id) : onUpvote(tip._id));

  return (
    <article
      className={`${styles.row} ${isOwner ? styles.ownerRow : ''}`}
      aria-label={`Tip: ${tip.title}`}
    >
      {isOwner && <span className={styles.ownerBadge}>Trip owner</span>}
      <div className={styles.body}>
        <div className={styles.left}>
          <div className={styles.titleRow}>
            <p className={styles.title}>{tip.title}</p>
            {tip.isVerified && (
              <span className={styles.verified} aria-label="Community verified tip">
                ⭐ verified
              </span>
            )}
          </div>
          <p className={styles.desc}>{tip.description}</p>
          <div className={styles.tags} aria-label="Tags">
            {[...tip.tripTypeTags, ...tip.climateTags].slice(0, 4).map((tag, i) => (
              <span key={tag} className={`${styles.tag} ${styles[`tag_${tagColors[i % 3]}`]}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.right}>
          <button
            className={`${styles.upvote} ${hasUpvoted ? styles.upvoted : ''}`}
            onClick={handleVote}
            aria-pressed={hasUpvoted}
            aria-label={hasUpvoted ? `Remove upvote from "${tip.title}"` : `Upvote "${tip.title}"`}
          >
            <span className={styles.arrow} aria-hidden="true">
              ▲
            </span>
            <span className={styles.count} aria-live="polite" aria-atomic="true">
              {tip.upvoteCount}
            </span>
          </button>
          <p className={styles.author}>{tip.authorName}</p>
        </div>
      </div>
    </article>
  );
};

TipCard.propTypes = {
  tip: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    authorName: PropTypes.string,
    tripTypeTags: PropTypes.arrayOf(PropTypes.string).isRequired,
    climateTags: PropTypes.arrayOf(PropTypes.string).isRequired,
    upvoteCount: PropTypes.number.isRequired,
    isVerified: PropTypes.bool,
  }).isRequired,
  hasUpvoted: PropTypes.bool,
  isOwner: PropTypes.bool,
  onUpvote: PropTypes.func.isRequired,
  onRemoveUpvote: PropTypes.func.isRequired,
};
TipCard.defaultProps = { hasUpvoted: false, isOwner: false };

export default TipCard;
