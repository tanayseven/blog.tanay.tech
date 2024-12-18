import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

export default function Home() {
  const blogDirectory = path.join(process.cwd(), "blogs");
  const fileNames = fs.readdirSync(blogDirectory);

  const blogs = fileNames.map((fileName) => {
    const slug = fileName.replace(".mdx", "");
    const fullPath = path.join(blogDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { data: frontMatter } = matter(fileContents);

    const date = new Date(frontMatter.date);

    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return {
      slug,
      formattedDate,
      meta: frontMatter,
    };
  }).sort((a, b) => {
    const dateA = new Date(a.formattedDate);
    const dateB = new Date(b.formattedDate);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div>
      <div className="flex flex-col gap-8">
        <h1 className="font-bold text-4xl">Welcome to Tanay&apos;s Blog</h1>
        <div className="flex flex-col gap-2">
          <p>This Blog has just been migrated from a differnet tech stack, so looks very raw</p>
          <Link
            className="underline"
            target="_blank"
            href="https://github.com/tanayseven/blog.tanay.tech"
          >
            Get the code at Github. Installation instructions are in the README.
          </Link>
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="font-bold text-2xl">Blog Posts</h2>

          <ul className="flex flex-col gap-4">
            {blogs.map((blog) => (
              <li key={blog.slug} className="border px-3 py-2 rounded-xl">
                <Link href={`/blog/${blog.slug}/`}>
                  <h3 className="font-bold text-xl">{blog.meta.title}</h3>
                  <div>{blog.formattedDate}</div>
                  <div>{blog.meta.description}</div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
