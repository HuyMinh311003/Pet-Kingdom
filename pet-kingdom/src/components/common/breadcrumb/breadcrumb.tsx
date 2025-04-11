// src/components/Breadcrumb.tsx
import { Link, useLocation } from "react-router-dom";
import React from "react";

const Breadcrumb: React.FC = () => {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="breadcrumb" style={{ padding: "1rem" }}>
      <Link to="/">Home</Link>
      {pathnames.map((name, index) => {
        const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
        const isLast = index === pathnames.length - 1;

        const displayName = decodeURIComponent(name);

        return isLast ? (
          <span key={index}> / {displayName}</span>
        ) : (
          <span key={index}>
            {" "}
            / <Link to={routeTo}>{displayName}</Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
