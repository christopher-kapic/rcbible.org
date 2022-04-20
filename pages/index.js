import Head from 'next/head'
import Link from 'next/link'

import douay from '../public/drbo.json'

export default function Index({books}) {
  return (
    <div>
      <Head>
        <title>RC Bible</title>
        <meta name="description" content="A pretty website for reading the Douay-Rheims Bible" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {
        books.map(book => {
          return (<div key={book.BookNumber}><Link href={`/${book.toLowerCase().replace(" ", "_")}`}><a>{book}</a></Link></div>)
        })
      }

    </div>
  )
}

export async function getStaticProps(context) {
  const books = douay.map(book => book.Title)
  return {
    props: {books}, // will be passed to the page component as props
  }
}