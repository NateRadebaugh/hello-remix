import { Link } from "@remix-run/react";

export default function Header() {
  return (
    <header className="p-3 mb-3 border-bottom">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li>
              <Link to="/" className="nav-link px-2 link-secondary">
                Overview
              </Link>
            </li>
            <li>
              <Link to="/posts" className="nav-link px-2 link-dark">
                Posts
              </Link>
            </li>
            <li>
              <Link to="/admin" className="nav-link px-2 link-dark">
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
