import douay from '../../../public/drbo.json'
import Head from 'next/head'
import Link from 'next/link'

export default function Index({book, chapter}) {
  return (
    <div>
      <Head>
        <title>RC Bible</title>
        <meta name="description" content="A pretty website for reading the Douay-Rheims Bible" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>{book} - {chapter.ChapterNumber}</h1>
      <p>{chapter.Summary}</p>
      
      {chapter.Verses.map(verse => {
        return(
          <div>
            {verse.Text}
          </div>
        )
      })}

      {/* {book.Chapters.map(chapter => {
        return (
          <div>
            <Link href={`/${book.Title.toLowerCase().replace(" ", "_")}/${chapter.ChapterNumber}`}><a>{chapter.ChapterNumber}: {chapter.Summary}</a></Link>
          </div>
        )
      })} */}

    </div>
  )
}

export async function getStaticPaths() {
  // const paths = douay.map(book => {
  //   return {
  //     params: {
  //       (book.Chapters.map(chapter => {
  //         return {
  //           book: book.Title.toLowerCase().replace(" ", "_"),
  //           chapter: chapter.ChapterNumber
  //         }
  //       }))
  //     }
  //   }
  // })
  let paths = [];
  // let books = douay.map(book => book.Title.toLowerCase().replace(" ", "_"))
  // let chapters;
  for (let i = 0; i < douay.length; i++) {
    // chapters[douay[i].Title.toLowerCase().replace(" ", "_")] = 
    // douay[i].Chapters.map(chapter => chapter.ChapterNumber)
    for (let j = 0; j < douay[i].Chapters.length; j++) {
      paths.push({params: {
        book: douay[i].Title.toLowerCase().replace(" ", "_"),
        chapter: douay[i].Chapters[j].ChapterNumber.toString()
      }})
    }
  }
  // console.log(chapters)
  return {
    paths: paths,
    fallback: false // false or 'blocking'
  };
}

export async function getStaticProps({params}) {
  const { book, chapter } = params;
  let to_return_chapter;
  let to_return_book;
  for (let i = 0; i < douay.length; i++) {
    if (douay[i].Title.toLowerCase().replace(" ", "_") !== params.book) {
      continue;
    }
    to_return_chapter = douay[i].Chapters[chapter - 1];
    to_return_book = douay[i].Title
  }


  return {
    props: {
      chapter: to_return_chapter,
      book: to_return_book
    }
  }
}