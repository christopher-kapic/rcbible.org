import douay from '../../public/drbo.json'
import Head from 'next/head'
import Link from 'next/link'

export default function Index({bookInfo: book}) {
  return (
    <div>
      <Head>
        <title>RC Bible</title>
        <meta name="description" content="A pretty website for reading the Douay-Rheims Bible" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>{book.Title}</h1>

      {book.Chapters.map(chapter => {
        return (
          <div>
            <Link href={`/${book.Title.toLowerCase().replace(" ", "_")}/${chapter.ChapterNumber}`}><a>{chapter.ChapterNumber}: {chapter.Summary}</a></Link>
          </div>
        )
      })}

    </div>
  )
}

export async function getStaticPaths() {
  const paths = douay.map(book => {
    return {
      params: { book: book.Title.toLowerCase().replace(" ", "_") }
    }
  })
  return {
    paths: paths,
    fallback: false // false or 'blocking'
  };
}

export async function getStaticProps({params}) {
  let bookInfo;
  for (let i = 0; i < douay.length; i++) {
    if (douay[i].Title.toLowerCase().replace(" ", "_") !== params.book) {
      continue;
    }
    bookInfo = douay[i]
  }

  return {
    props: {bookInfo}, // will be passed to the page component as props
  }
}