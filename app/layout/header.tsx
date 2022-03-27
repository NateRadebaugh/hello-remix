import { Link } from "remix";

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
              <Link
                to="/admin/app/code-detail"
                className="nav-link px-2 link-dark"
              >
                Admin - App Code Detail
              </Link>
            </li>
            <li>
              <Link to="/admin/posts" className="nav-link px-2 link-dark">
                Admin - Posts
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
