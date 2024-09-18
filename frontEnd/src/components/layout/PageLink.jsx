import { Link } from "react-router-dom";

const PageLink = ({ link, itemClass }) => {
  return (
    <Link to={link.href} className={itemClass}>
      {link.text}
    </Link>
  );
};

export default PageLink;
