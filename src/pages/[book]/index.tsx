import { GetStaticPaths, GetStaticProps, type NextPage } from "next";
import books from "../../utils/douay-rheims-json/books.json";
import Link from "next/link";

export const getStaticPaths: GetStaticPaths = () => {
  const paths = books.map((book) => {
    return {
      params: { book: book.shortname.replace(" ", "_").toLowerCase() },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = (context) => {
  // This is where the error occurs
  // const { slug } = context.params // Property 'slug' does not exist on type 'ParsedUrlQuery | undefined'
  const { params } = context;
  const book = books.filter((_book) => {
    return _book.shortname.replace(" ", "_").toLowerCase() === params?.book;
  })[0];
  return { props: { book } };
};

const Book: NextPage<{
  book: {
    booknumber: number;
    shortname: string;
    contentsname: string;
    bookname: string;
    chapters: {
      chaptername: string;
      chapterdesc: string;
      chapternumber: number;
    }[];
    bookdesc?: undefined;
  };
}> = ({ book }) => {
  // const { book } = params;
  // console.log(book)
  return (
    <div>
      <h1>{book.shortname}</h1>
      <ol>
        {book.chapters.map((chapter) => {
          return (
            <li key={chapter.chapternumber}>
              <Link
                href={`/${book.shortname.replace(" ", "_").toLowerCase()}/${
                  chapter.chapternumber
                }`}
              >
                {chapter.chapternumber} - {chapter.chapterdesc}
              </Link>
            </li>
          );
        })}
      </ol>
      {/* <ol>
        {book?.chapters.map((chapter) => {
          return (
            <li>
              <Link href={`/${book.s}/${chapter.chapternumber}`}>
                {chapter.chapternumber} - {chapter.chapterdesc}
              </Link>
            </li>
          );
        })}
      </ol> */}
    </div>
  );
};

export default Book;
