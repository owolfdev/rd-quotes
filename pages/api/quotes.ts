import { NextApiRequest, NextApiResponse } from "next";
import quotes from "../../public/quotes.json";

interface QuoteData {
  author: string;
  quote: string;
}

interface ErrorResponse {
  message: string;
}

export default (
  req: NextApiRequest,
  res: NextApiResponse<QuoteData[] | ErrorResponse>
) => {
  const { search } = req.query;
  if (!search) {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    return res.status(200).json([quote]);
  }

  const searchRegex = new RegExp(`\\b${search.toString()}\\b`, "i");
  const filteredQuotes = quotes.filter((quote) =>
    searchRegex.test(quote.quote)
  );

  if (filteredQuotes.length === 0) {
    return res.status(404).json({ message: "No quotes found." });
  }

  return res.status(200).json(filteredQuotes);
};
