import React from 'react';
import styles from '../../styles/Idea.module.css'; // Updated import to Idea module CSS

const IdeaViewToggle = ({ onViewChange }) => { // Changed component name to IdeaViewToggle
  const handleButtonClick = (view) => {
    onViewChange(view);
  };

  return (
    <div className={styles.ideaViewToggle}> 
      <button
        className={styles.ideaViewButton} 
        onClick={() => handleButtonClick('own')}
      >
        Own
      </button>
      <button
        className={styles.ideaViewButton}
        onClick={() => handleButtonClick('all')}
      >
        All
      </button>
    </div>
  );
};

export default IdeaViewToggle;
