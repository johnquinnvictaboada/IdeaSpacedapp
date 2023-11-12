import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useIdea } from '../hooks/idea.'; // Changed import to useIdea
import Loading from '../components/Loading';
import IdeaSection from '../components/idea/IdeaSection'; // Updated component to IdeaSection
import IdeaViewToggle from '../components/idea/IdeaViewToggle'; // Updated component to IdeaViewToggle
import styles from '../styles/Home.module.css';
import { useState } from 'react';

const Home = () => {
  const {
    initialized,
    initializeUser,
    loading,
    transactionPending,
    ideas, // Changed variable name to ideas
    allIdeas, // Changed variable name to allIdeas
    addIdea, // Changed function name to addIdea
    removeIdea, // Changed function name to removeIdea
    input,
    handleChange,
  } = useIdea(); // Updated hook to useIdea

  const [view, setView] = useState('all');

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div className=''>
      
        <div className={styles.container}>
          <div className={styles.actionsContainer}>
            {initialized ? (
              <div className={styles.ideaInput}> {/* Updated className to reflect the change */}
                <div className={`${styles.ideaCheckbox} ${styles.checked}`} /> {/* Updated className to reflect the change */}
                <div className={styles.inputContainer}>
                  <form onSubmit={addIdea}> {/* Updated function to addIdea */}
                    <input
                      value={input}
                      onChange={handleChange}
                      id={styles.inputField}
                      type="text"
                      placeholder="Share Ur Ideas"
                    />
                  </form>
                </div>
                <div className={styles.iconContainer}></div>
              </div>
            ) : (
              <button
                type="button"
                className={styles.button}
                onClick={() => initializeUser()}
                disabled={transactionPending}
              >
                Initialize
              </button>
            )}
            <WalletMultiButton />
          </div>

          <div className={styles.mainContainer}>
            <IdeaViewToggle onViewChange={handleViewChange} /> {/* Updated component to IdeaViewToggle */}
            <Loading loading={loading}>
              {view === 'own' ? (
                <IdeaSection // Updated component to IdeaSection
                  title="Yours"
                  ideas={ideas} // Updated variable name to ideas
                  action={removeIdea} // Updated function to removeIdea
                />
              ) : (
                <IdeaSection // Updated component to IdeaSection
                  title="All"
                  ideas={allIdeas} // Updated variable name to allIdeas
                  action={removeIdea} // Updated function to removeIdea
                />
              )}
            </Loading>
          </div>
    </div>
    </div>
    
  );
};

export default Home;
