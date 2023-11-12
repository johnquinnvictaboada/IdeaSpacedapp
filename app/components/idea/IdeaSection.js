import styles from '../../styles/Idea.module.css'; // Updated import to Idea module CSS
import IdeaList from './IdeaList'; // Updated import to IdeaList

const IdeaSection = ({ title, ideas, action }) => { // Changed component name to IdeaSection, and updated props
  return (
    <div className={styles.ideaSection}> {/* Updated className to reflect the change */}
      <h1 className="title"> {/* Updated className to reflect the change */}
        {title} - {ideas.length} {/* Updated variable name to reflect the change */}
      </h1>

      <IdeaList ideas={ideas} action={action} /> {/* Updated component to IdeaList, and updated props */}
    </div>
  );
};

export default IdeaSection;
