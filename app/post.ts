import { matchSorter } from "match-sorter";
import path from "path";
import fs from "fs/promises";
import parseFrontMatter from "front-matter";
import invariant from "tiny-invariant";
import { marked } from "marked";
import { json } from "@remix-run/node";

export interface Post {
  slug: string;
  title: string;
  type: string | "";
  html: string;
}

export interface PostSource {
  slug: string;
  title: string;
  type: string | "";
  markdown: string;
}

export interface PostMarkdownAttributes {
  title: string;
  type: string | "";
}

const postsPath = path.join(__dirname, "..", "posts");

export function isValidPostAttributes(
  attributes:
    | Record<string, unknown>
    | PostMarkdownAttributes
    | null
    | undefined
): attributes is PostMarkdownAttributes {
  if (attributes?.title) {
    return true;
  }

  return false;
}

export async function getPosts(): Promise<Omit<Post, "html">[]> {
  const dir = await fs.readdir(postsPath);
  return Promise.all(
    dir.map(async (filename) => {
      const file = await fs.readFile(path.join(postsPath, filename));
      const { attributes } = parseFrontMatter<Record<string, unknown>>(
        file.toString()
      );
      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad meta data!`
      );

      return {
        slug: filename.replace(/\.md$/, ""),
        title: attributes.title,
        type: attributes.type,
      };
    })
  );
}

export async function searchPosts(
  q: string | undefined
): Promise<Omit<Post, "html">[]> {
  const dir = await fs.readdir(postsPath);
  const allPosts = await Promise.all(
    dir.map(async (filename) => {
      const file = await fs.readFile(path.join(postsPath, filename));
      const { attributes } = parseFrontMatter<PostMarkdownAttributes>(
        file.toString()
      );
      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad meta data!`
      );

      return {
        slug: filename.replace(/\.md$/, ""),
        title: attributes.title,
        type: attributes.type,
      };
    })
  );

  if (!q) {
    //return [];
  }

  const filteredPosts = matchSorter(allPosts, q ?? "", { keys: ["title"] });
  return filteredPosts;
}

export interface SelectOption {
  value: string;
  label: string;
}

export async function searchPostTypes(q: string | undefined) {
  const options: SelectOption[] = [
    { value: "info", label: "Info" },
    { value: "success", label: "Success" },
    { value: "warning", label: "Warning" },
    { value: "danger", label: "Danger" },
  ];

  if (!q) {
    //return [];
  }

  const filtered = matchSorter(options, q ?? "", { keys: ["label"] });
  return filtered;
}

export async function getPost(slug: string): Promise<Post> {
  const filepath = path.join(postsPath, slug + ".md");
  const file = await fs.readFile(filepath);
  const { attributes, body } = parseFrontMatter<PostMarkdownAttributes>(
    file.toString()
  );
  invariant(
    isValidPostAttributes(attributes),
    `Post ${filepath} is missing attributes`
  );

  const html = marked(body);
  return { slug, title: attributes.title, type: attributes.type, html };
}

export async function getPostSource(slug: string): Promise<PostSource> {
  const filepath = path.join(postsPath, slug + ".md");
  const file = await fs.readFile(filepath);
  const { attributes, body } = parseFrontMatter<PostMarkdownAttributes>(
    file.toString()
  );

  invariant(
    isValidPostAttributes(attributes),
    `Post ${filepath} is missing attributes`
  );

  return {
    slug,
    title: attributes.title,
    type: attributes.type,
    markdown: body,
  };
}

type NewPost = {
  slug: string;
  title: string;
  type: string;
  markdown: string;
};

export async function createPost(post: NewPost) {
  const md = `---\ntitle: ${post.title}\ntype: ${post.type}\n---\n\n${post.markdown}`;
  await fs.writeFile(path.join(postsPath, post.slug + ".md"), md);
  return json(await getPost(post.slug));
}

type UpdatePost = {
  slug: string;
  title: string;
  type: string;
  markdown: string;
};

export async function updatePost(post: UpdatePost) {
  const md = `---\ntitle: ${post.title}\ntype: ${post.type}\n---\n\n${post.markdown}`;
  await fs.writeFile(path.join(postsPath, post.slug + ".md"), md);
  return json(await getPost(post.slug));
}
