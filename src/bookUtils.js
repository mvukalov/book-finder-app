export const GOOGLE_BOOKS_KEY = process.env.REACT_APP_GOOGLE_BOOKS_KEY;
export const TOP_BOOK_SUBJECTS = ["fiction", "fantasy", "history", "science", "biography", "business"];

export function cleanDescription(value) {
  if (!value) return "No description available.";

  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function mapGoogleBookToListItem(item) {
  const info = item.volumeInfo ?? {};

  return {
    imdbID: item.id,
    Title: info.title ?? "Untitled",
    Year: info.publishedDate?.slice(0, 4) ?? "N/A",
    Poster: info.imageLinks?.medium ?? info.imageLinks?.thumbnail ?? "",
    averageRating: info.averageRating ?? 0,
    ratingsCount: info.ratingsCount ?? 0,
  };
}

export function communityBookScore(book) {
  const rating = Number(book.averageRating) || 0;
  const votes = Number(book.ratingsCount) || 0;

  return rating * Math.log10(votes + 1);
}

export function mapGoogleBookDetails(item) {
  const info = item.volumeInfo ?? {};

  return {
    Title: info.title ?? "Untitled",
    Year: info.publishedDate?.slice(0, 4) ?? "N/A",
    Poster: info.imageLinks?.large ?? info.imageLinks?.medium ?? info.imageLinks?.thumbnail ?? "",
    Runtime: info.pageCount ? `${info.pageCount} pages` : "0 pages",
    imdbRating: info.averageRating ?? 0,
    Plot: cleanDescription(info.description),
    Released: info.publishedDate ?? "N/A",
    Actors: info.authors?.join(", ") ?? "Unknown author",
    Director: info.publisher ?? "Unknown publisher",
    Genre: info.categories?.join(", ") ?? "General",
  };
}
