import { Link } from "remix";

export default function PostsIndex() {
  return (
    <p>
      <Link to="new">Create a New Post</Link>
    </p>
  );
}
