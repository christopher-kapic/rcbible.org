import { GetStaticPaths, GetStaticProps, type NextPage } from "next";
import books from "../../../utils/douay-rheims-json/books.json";
import verses from "../../../utils/douay-rheims-json/verses.json";

export const getStaticPaths: GetStaticPaths = () => {
  const paths: { params: { book: string; chapter: string } }[] = [];

  books.forEach((book) => {
    book.chapters.forEach((chapter) => {
      paths.push({
        params: {
          book: book.shortname.replace(" ", "_").toLowerCase(),
          chapter: chapter.chapternumber.toString(),
        },
      });
    });
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = (context) => {
  const { params } = context;

  const book = books.filter((_book) => {
    return _book.shortname.replace(" ", "_").toLowerCase() === params?.book;
  })[0];

  const chapter: {versenumber: number, text: string, booknumber: number, chapternumber: number, notes?: string[]}[] = [];
  // const _verses: any = verses;

  for (let i = 0; i < verses.length; i++) {
    console.log(i)
  }

  // const chapter: {
  //   versenumber: number;
  //   text: string;
  //   booknumber: number;
  //   chapternumber: number;
  //   notes?: string[];
  // } = _verses.filter(
  //   (_verse: {
  //     versenumber: number;
  //     text: string;
  //     booknumber: number;
  //     chapternumber: number;
  //     notes?: string[];
  //   }) => {
  //     return (
  //       _verse.booknumber === book?.booknumber &&
  //       _verse.chapternumber.toString() === params?.chapter
  //     );
  //   }
  // );

  return { props: { book, chapter } };
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
  chapter: {
    versenumber: number;
    text: string;
    booknumber: number;
    chapternumber: number;
    notes?: string[];
  }[];
}> = ({ book, chapter }) => {
  return (
    <div>
      <h1>
        {book.shortname} - {chapter[0]?.chapternumber}
      </h1>
      <p>
        {chapter.map((verse) => {
          return <span key={verse.versenumber}>{verse.text} </span>;
        })}
      </p>
    </div>
  );
};

export default Book;
