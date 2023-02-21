import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import books from "../utils/douay-rheims-json/books.json";

const Books: NextPage = () => {
  return (
    <>
      <Head>
        <title>RCBible.org</title>
        <meta
          name="description"
          content="Online Douay Rheims for Traditional Catholics"
        />
        <link rel="icon" href="/icon-192x192.png" />
      </Head>
      <main className="max-w-2xl p-4">
        <h1 className="text-3xl text-gray-900">Books</h1>
        {books.map((book) => {
          return (
            <Link
              className="block text-xl text-blue-900"
              href={`/${book.shortname.toLowerCase().replace(" ", "_")}`}
              key={book.booknumber}
            >
              {book.shortname}
            </Link>
          );
        })}
      </main>
    </>
  );
};

export default Books;
