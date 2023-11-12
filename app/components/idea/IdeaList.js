import styles from '../../styles/Idea.module.css'; // Updated import to Idea module CSS
import IdeaItem from './IdeaItem'; // Updated import to IdeaItem

const IdeaList = ({ ideas, action }) => { // Changed component name to IdeaList
  return (
    <ul className={styles.ideaList}> {/* Updated className to reflect the change */}
      {ideas.map((idea) => ( // Updated variable names to reflect the change
        <IdeaItem // Updated component to IdeaItem
          key={idea.account.idx} // Updated variable names to reflect the change
          {...idea.account} // Updated variable names to reflect the change
          publicKey={idea.publicKey} // Updated variable names to reflect the change
          action={action}
        />
      ))}
    </ul>
  );
};

export default IdeaList;
