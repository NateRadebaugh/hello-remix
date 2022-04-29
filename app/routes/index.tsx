import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <Link to="/posts">Posts</Link>
        </li>
        <li>
          App
          <ul>
            <li>
              <Link to="/admin/app/code-detail">Code Detail</Link>
            </li>
          </ul>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
