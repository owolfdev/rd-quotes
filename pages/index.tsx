import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";

interface Quote {
  author: string;
  quote: string;
}

const Home = ({ quoteData }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [randomQuote, setRandomQuote] = useState(quoteData);
  const [searching, setSearching] = useState(false);

  const refreshRandomQuote = async () => {
    const response = await fetch("/api/quotes");
    const data = await response.json();
    setRandomQuote(data);
    setSearching(false);
  };

  const handleSearch = async (event: any) => {
    event.preventDefault();

    const response = await fetch(`/api/quotes?search=${searchTerm}`);
    const data = await response.json();
    setSearching(true);
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
      <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-baseline mb-3 space-x-5">
            <h1 className="text-4xl font-bold">
              Random Rodney Dangerfield Quote:
            </h1>
          </div>

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
                <div className="absolute bottom-0 z-10 w-full pb-16 pl-10 sm:relative sm:w-7/12">
                  <p className="pl-2 pr-2 mb-4 text-2xl font-semibold text-white bg-black bg-opacity-50 rounded sm:pl-0 sm:bg-transparent sm:text-4xl sm:drop-shadow-sm drop-shadow-2xl">
                    {randomQuote[0].quote}
                  </p>
                  <footer className="pl-2 text-xl font-bold text-white sm:pl-0">
                    {randomQuote[0].author}
                  </footer>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-full opacity-30 bg-gradient-to-t from-black via-transparent"></div>
              </>
            )}
            <button
              onClick={refreshRandomQuote}
              className="absolute bottom-0 left-0 z-20 mb-2 ml-2 text-2xl text-white hover:text-gray-300 active:text-white"
            >
              <HiOutlineRefresh />
            </button>
          </blockquote>

          <h1 className="mt-12 mb-4 text-4xl font-bold">Search Quotes:</h1>
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              placeholder="Enter search term"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600 active:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 ml-2 font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Search
            </button>
          </form>
          <ul className="mt-6 space-y-6">
            {quotes.length !== 0
              ? quotes.map((quote: any, index: any) => (
                  <li key={index}>
                    <blockquote className="p-6 bg-white rounded shadow">
                      <p className="mb-4 text-xl">{quote.quote}</p>
                      <footer className="font-semibold text-gray-500">
                        {quote.author}
                      </footer>
                    </blockquote>
                  </li>
                ))
              : searching && (
                  <blockquote className="p-6 bg-white rounded shadow">
                    <p className="mb-4 text-xl">
                      No Results. Please try again.
                    </p>
                  </blockquote>
                )}
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
