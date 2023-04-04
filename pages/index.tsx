import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

interface Quote {
  author: string;
  quote: string;
}

const Home = ({ quoteData }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [quotes, setQuotes] = useState<Quote[]>([]);

  const handleSearch = async (event: any) => {
    event.preventDefault();
    const response = await fetch(`/api/quotes?search=${searchTerm}`);
    const data = await response.json();
    if (Array.isArray(data)) {
      setQuotes(data);
    } else {
      setQuotes([]);
    }
  };

  return (
    <>
      <Head>
        <title>Quote API Demo</title>
        <meta name="description" content="Demo for Quote API" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Random Rodney Dangerfield Quote:
          </h1>

          <blockquote
            className="bg-white p-6 rounded shadow relative overflow-hidden h-[425px] flex flex-col items-end justify-center"
            style={{
              backgroundImage: `url('/rodney-dangerfield.jpg')`,
              backgroundPosition: "left center",
              backgroundSize: "cover",
            }}
          >
            {quoteData && (
              <>
                <div className="relative z-10 w-7/12 pl-10 pb-5">
                  <p className="text-4xl mb-4 text-white font-semibold pr-2 drop-shadow-sm ">
                    {quoteData[0].quote}
                  </p>
                  <footer className="text-white font-bold text-xl">
                    {quoteData[0].author}
                  </footer>
                </div>
              </>
            )}
          </blockquote>

          <h1 className="text-4xl font-bold mt-12 mb-4">Search Quotes:</h1>
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              placeholder="Enter search term"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Search
            </button>
          </form>
          <ul className="mt-6 space-y-6">
            {quotes &&
              quotes.map((quote: any, index: any) => (
                <li key={index}>
                  <blockquote className="bg-white p-6 rounded shadow">
                    <p className="text-xl mb-4">{quote.quote}</p>
                    <footer className="text-gray-500 font-semibold">
                      {quote.author}
                    </footer>
                  </blockquote>
                </li>
              ))}
          </ul>
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps({ req }: any) {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const baseUrl = `${protocol}://${req.headers.host}/`;

  const response = await fetch(`${baseUrl}api/quotes`);
  const data = await response.json();
  return {
    props: {
      quoteData: data,
    },
  };
}

export default Home;
