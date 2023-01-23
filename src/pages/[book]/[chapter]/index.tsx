import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import books from "../../../utils/douay-rheims-json/books.json";
import verses from "../../../utils/douay-rheims-json/verses.json";
import { AudioContext } from "../../../components/AudioPlayer";
import { useContext, useEffect } from "react";
import { env } from "../../../env/client.mjs";

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

  verses.forEach(verse => {
    if (verse.booknumber === book?.booknumber && Number(params?.chapter) === verse.chapternumber) {
      chapter.push(verse)
    }
  })

  return { props: { book, chapter } };
};

const Chapter: NextPage<{
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
  const router = useRouter();
  const [audioContext, setAudioContext] = useContext(AudioContext)
  useEffect(() => {
    if (audioContext.currentTrack !== chapter[0]!.chapternumber - 1) {
      router.push(`/${book.shortname.toLowerCase().replace(" ", "_")}/${audioContext.currentTrack + 1}`).catch(e => {console.error(e)})
    }
  }, [audioContext])
  return (
    <div>
      <h1>
        {book.shortname} - {chapter[0]?.chapternumber}
      </h1>
      <button
      onClick={() => {
        const audioFiles: string[] = book.chapters.map(chapter => {
          return `${env.NEXT_PUBLIC_BASE_AUDIO_URL}/${book.shortname.replace(" ", "_")}.${chapter.chapternumber}.mp3`
        })
        console.log(audioFiles)
        setAudioContext({currentTrack: chapter[0]!.chapternumber - 1, tracks: audioFiles})
      }}
      >Listen</button>
      <p>
        {chapter.map((verse) => {
          return <span key={verse.versenumber}>{verse.text} </span>;
        })}
      </p>
    </div>
  );
};

export default Chapter;
