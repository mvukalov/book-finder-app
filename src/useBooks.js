import { useEffect, useState } from "react";
import { GOOGLE_BOOKS_KEY, mapGoogleBookToListItem } from "./bookUtils";

export function useBooks(query, topBooks) {
  const [books, setBooks] = useState(topBooks ?? []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchBooks() {
        try {
          setIsLoading(true);
          setError("");

          if (!GOOGLE_BOOKS_KEY) throw new Error("Missing Google Books API key");

          const res = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${GOOGLE_BOOKS_KEY}`,
            { signal: controller.signal },
          );

          if (!res.ok) throw new Error("Something went wrong with fetching books");

          const data = await res.json();
          if (!data.items?.length) throw new Error("Book not found");

          setBooks(data.items.map(mapGoogleBookToListItem));
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setBooks(topBooks);
        setError("");
        setIsLoading(false);
        return;
      }

      fetchBooks();

      return function () {
        controller.abort();
      };
    },
    [query, topBooks],
  );

  return { books, isLoading, error };
}
