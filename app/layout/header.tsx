import { Link } from "@remix-run/react";
import type { SessionData } from "~/session";

export interface HeaderProps {
  session: SessionData;
}

export default function Header({ session }: HeaderProps) {
  return (
    <header className="py-3 mb-3 border-bottom">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-between justify-content-lg-start">
          <ul className="nav col-auto col-lg-auto me-lg-auto justify-content-start mb-md-0">
            <li className="nav-item">
              <Link to="/" className="nav-link px-2 link-secondary">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin" className="nav-link px-2 link-dark">
                Admin
              </Link>
            </li>
          </ul>

          <ul className="nav col-auto col-lg-auto me-lg-auto justify-content-end mb-md-0">
            {session.securityUser && (
              <>
                <li className="nav-link text-muted">
                  {session.securityUser.FirstName}{" "}
                  {session.securityUser.LastName}
                </li>
                <li className="nav-item">
                  <Link to="/logout" className="nav-link px-2 link-dark">
                    Log Out
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
