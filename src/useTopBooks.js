import { useEffect, useState } from "react";
import { GOOGLE_BOOKS_KEY, TOP_BOOK_SUBJECTS, communityBookScore, mapGoogleBookToListItem } from "./bookUtils";

export function useTopBooks() {
  const [topBooks, setTopBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(function () {
    const controller = new AbortController();

    async function fetchTopBooks() {
      try {
        setIsLoading(true);
        setError("");

        if (!GOOGLE_BOOKS_KEY) throw new Error("Missing Google Books API key");

        const settled = await Promise.allSettled(
          TOP_BOOK_SUBJECTS.map(async (subject) => {
            const response = await fetch(
              `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(subject)}&maxResults=20&orderBy=relevance&key=${GOOGLE_BOOKS_KEY}`,
              { signal: controller.signal },
            );

            if (!response.ok) return [];

            const payload = await response.json();
            return (payload.items ?? []).map(mapGoogleBookToListItem);
          }),
        );

        const mappedItems = settled.filter((result) => result.status === "fulfilled").flatMap((result) => result.value);

        if (mappedItems.length === 0) {
          const fallbackRes = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent("bestseller books")}&maxResults=40&orderBy=relevance&key=${GOOGLE_BOOKS_KEY}`,
            { signal: controller.signal },
          );

          if (!fallbackRes.ok) throw new Error("Could not load top books");

          const fallbackPayload = await fallbackRes.json();
          mappedItems.push(...(fallbackPayload.items ?? []).map(mapGoogleBookToListItem));
        }

        const uniqueBooks = Array.from(new Map(mappedItems.map((book) => [book.imdbID, book])).values());

        const strictRankedTop = uniqueBooks
          .filter((book) => book.averageRating > 0 && book.ratingsCount >= 50)
          .sort((a, b) => communityBookScore(b) - communityBookScore(a))
          .slice(0, 100);

        const relaxedRankedTop = uniqueBooks
          .filter((book) => book.averageRating > 0)
          .sort((a, b) => communityBookScore(b) - communityBookScore(a))
          .slice(0, 100);

        const fallbackTop = uniqueBooks.slice(0, 100);

        const rankedTop =
          strictRankedTop.length >= 20 ? strictRankedTop : relaxedRankedTop.length > 0 ? relaxedRankedTop : fallbackTop;

        if (rankedTop.length === 0) throw new Error("No ranked top books available");

        setTopBooks(rankedTop);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          console.log(err.message);
          setError("Could not load Top books right now");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchTopBooks();

    return function () {
      controller.abort();
    };
  }, []);

  return { topBooks, isLoading, error };
}
