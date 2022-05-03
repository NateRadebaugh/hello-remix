import { Link, NavLink as RawNavLink } from "@remix-run/react";
import type { RemixNavLinkProps } from "@remix-run/react/components";
import clsx from "clsx";
import type { SessionData } from "~/session";

function NavLink(
  props: Omit<
    RemixNavLinkProps & React.RefAttributes<HTMLAnchorElement>,
    "className"
  >
) {
  return (
    <RawNavLink
      {...props}
      className={({ isActive }) =>
        clsx([
          "nav-link px-2",
          isActive ? "link-dark fw-bold" : "link-secondary",
        ])
      }
    />
  );
}

export interface HeaderProps {
  session: SessionData;
}

export default function Header({ session }: HeaderProps) {
  return (
    <header className="bg-light py-3 mb-3 border-bottom">
      <div className="container">
        <div className="row flex-wrap align-items-center">
          🎪
          <ul className="nav col-auto">
            <li className="nav-item">
              <NavLink to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin">Admin</NavLink>
            </li>
          </ul>
          <ul className="nav col-auto ms-auto">
            {session.securityUser && (
              <>
                <li className="nav-link text-muted">
                  {session.securityUser.FirstName}{" "}
                  {session.securityUser.LastName}
                </li>
                <li className="nav-item">
                  <NavLink to="/logout">Log Out</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
