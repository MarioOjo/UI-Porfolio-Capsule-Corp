import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import './Breadcrumb.css';

function Breadcrumb({ separator = <FaChevronRight />, rootLabel = "Home" }) {
  const location = useLocation();
  const { pathname } = location;
  const pathnames = pathname.split("/").filter(x => x);

  return (
    <nav className="breadcrumb-nav" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link to="/">{rootLabel}</Link>
        </li>
        {pathnames.map((name, idx) => {
          const routeTo = `/${pathnames.slice(0, idx + 1).join("/")}`;
          const isLast = idx === pathnames.length - 1;
          return (
            <li key={routeTo} className={`breadcrumb-item${isLast ? " active" : ""}`}>
              {separator}
              {isLast ? (
                <span>{decodeURIComponent(name.replace(/-/g, ' '))}</span>
              ) : (
                <Link to={routeTo}>{decodeURIComponent(name.replace(/-/g, ' '))}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
