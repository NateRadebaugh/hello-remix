import { Link } from "@remix-run/react";

export default function PostsIndex() {
  return (
    <p>
      <Link to="new">Create a New Post</Link>
    </p>
  );
}
