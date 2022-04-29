import { Link } from "@remix-run/react";

interface FooterProps {
  year: number;
}

export default function Footer({ year }: FooterProps) {
  return (
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 px-3 my-4 border-top">
      <p className="col-md-4 mb-0 text-muted">© {year} Company, Inc</p>

      <ul className="nav col-md-4 justify-content-end">
        <li className="nav-item">
          <Link to="/" className="nav-link px-2 text-muted">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/admin/app/code-detail"
            className="nav-link px-2 text-muted"
          >
            App Code Detail
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/posts" className="nav-link px-2 text-muted">
            Posts
          </Link>
        </li>
      </ul>
    </footer>
  );
}
