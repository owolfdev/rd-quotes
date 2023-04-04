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

  const refreshRandomQuote = async () => {
    const response = await fetch("/api/quotes");
    const data = await response.json();
    setRandomQuote(data);
  };

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
          <div className="flex items-baseline space-x-5 mb-3">
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
                <div className="relative z-10 w-7/12 pl-10 pb-5">
                  <p className="text-4xl mb-4 text-white font-semibold pr-2 drop-shadow-sm ">
                    {randomQuote[0].quote}
                  </p>
                  <footer className="text-white font-bold text-xl">
                    {randomQuote[0].author}
                  </footer>
                </div>
              </>
            )}
            <button
              onClick={refreshRandomQuote}
              className="absolute mr-4 text-2xl left-0 bottom-0 mb-2 ml-2 text-white hover:text-gray-300 active:text-white"
            >
              <HiOutlineRefresh />
            </button>
          </blockquote>

          <h1 className="text-4xl font-bold mt-12 mb-4">Search Quotes:</h1>
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
