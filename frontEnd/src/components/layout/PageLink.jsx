import { Link } from "react-router-dom";

const PageLink = ({ link, itemClass, searchInnerSpanClass }) => {
  return (
    <Link to={link.href} className={itemClass}>
      {searchInnerSpanClass ? (
        <span className={searchInnerSpanClass}>{link.text}</span> // Use span for search button
      ) : (
        link.text // Regular text for other links
      )}
    </Link>
  );
};

export default PageLink;
