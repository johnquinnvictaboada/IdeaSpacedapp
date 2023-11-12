import styles from '../../styles/Idea.module.css'; // Updated import to Idea module CSS
import { CalendarIcon, TrashIcon } from '@heroicons/react/outline';
import sliceAddress from '../../utils/sliceAddress';

const IdeaItem = ({ // Changed component name to IdeaItem
  idx,
  content,
  marked,
  dateline,
  publicKey,
  action,
  authority,
}) => {
  const handleMarkIdea = () => { // Updated function name to handleMarkIdea
    // Only allow unchecked idea to be marked
    if (marked) return;

    action(idx);
  };

  const handleRemoveIdea = () => { // Updated function name to handleRemoveIdea
    // Only allow checked idea to be removed
    if (!marked) return;

    action(publicKey, idx);
  };

  return (
    <li key={idx} className={styles.ideaItem}> {/* Updated className to reflect the change */}
      <div className={styles.contentContainer}> {/* Updated className to reflect the change */}
        <span className="ideaText">{content}</span> {/* Updated className to reflect the change */}

        {dateline && (
          <div className={styles.ideaDateline}> {/* Updated className to reflect the change */}
            <CalendarIcon className={styles.calendarIcon} />
            <span>{dateline}</span>
          </div>
        )}
        <div className={styles.addressContainer}>
          <span className={styles.address}>
            by:{' '}
            <a
              href={`https://explorer.solana.com/address/${authority.toString()}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {sliceAddress(authority.toString())}
            </a>
          </span>
          <span className={styles.address}>
            pubKey:{' '}
            <a
              href={`https://explorer.solana.com/address/${publicKey.toString()}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {sliceAddress(publicKey.toString())}
            </a>
          </span>
        </div>
      </div>
      {/* <div className={styles.iconContainer}>
        <TrashIcon
          onClick={handleRemoveIdea} 
          className={`${styles.trashIcon} ${!marked && styles.checked}`}
        />
      </div> */}
    </li>
  );
};

export default IdeaItem;
