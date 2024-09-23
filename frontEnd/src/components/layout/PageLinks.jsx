import PageLink from './PageLink';

const pageLinks = [
<<<<<<< HEAD
  { id: 1, href: "/", text: "home" },
=======
  { id: 1, href: "/home", text: "home" },
>>>>>>> vietbe
  { id: 2, href: "/search", text: "search" },
  { id: 3, href: "/cabinet", text: "cabinet" },
  { id: 4, href: "/about", text: "about" }
];

const PageLinks = ({ parentClass, itemClass }) => {
  return (
    <div className={parentClass}>
      {pageLinks.map((link) => {
        return <PageLink key={link.id} link={link} itemClass={itemClass} />;
      })}
    </div>
  );
};

export default PageLinks;

