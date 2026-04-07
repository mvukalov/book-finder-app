import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { GOOGLE_BOOKS_KEY, mapGoogleBookDetails } from "./bookUtils";
import { useBooks } from "./useBooks";
import { useTopBooks } from "./useTopBooks";

const average = (arr) => arr.reduce((acc, cur, i, source) => acc + cur / source.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedBookId, setSelectedBookId] = useState(null);
  const { topBooks, isLoading: isLoadingTop, error: topError } = useTopBooks();
  const { books, isLoading: isLoadingSearch, error: searchError } = useBooks(query, topBooks);

  const isLoading = isLoadingTop || isLoadingSearch;
  const error = query.length < 3 ? topError : searchError;

  const [readBooks, setReadBooks] = useState(function () {
    const storedValue = localStorage.getItem("readBooks");
    if (!storedValue) return [];

    try {
      const parsed = JSON.parse(storedValue);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  function handleSelectBook(id) {
    setSelectedBookId((currentId) => (id === currentId ? null : id));
  }

  function handleCloseBook() {
    setSelectedBookId(null);
  }

  function handleAddReadBook(book) {
    setReadBooks((current) => [...current, book]);
  }

  function handleDeleteReadBook(id) {
    setReadBooks((current) => current.filter((book) => book.imdbID !== id));
  }

  useEffect(
    function () {
      localStorage.setItem("readBooks", JSON.stringify(readBooks));
    },
    [readBooks],
  );

  useEffect(
    function () {
      if (query.length >= 3) handleCloseBook();
    },
    [query],
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults books={books} query={query} />
      </NavBar>

      <Main>
        <Box>
          {query.length < 3 && <h2 className="top-books-title">Top books</h2>}
          {isLoading && <Loader />}
          {!isLoading && !error && <BookList books={books} onSelectBook={handleSelectBook} />}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedBookId ? (
            <BookDetails
              selectedBookId={selectedBookId}
              onCloseBook={handleCloseBook}
              onAddReadBook={handleAddReadBook}
              readBooks={readBooks}
            />
          ) : (
            <>
              <ReadBooksSummary readBooks={readBooks} />
              <ReadBooksList readBooks={readBooks} onDeleteReadBook={handleDeleteReadBook} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔️</span> {message}
    </p>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">📚</span>
      <h1>Book Finder</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputEl.current) return;

        if (e.code === "Enter") {
          inputEl.current.focus();
          setQuery("");
        }
      }

      document.addEventListener("keydown", callback);
      return () => document.removeEventListener("keydown", callback);
    },
    [setQuery],
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search books and stories..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NumResults({ books, query }) {
  return (
    <p className="num-results">
      {query.length < 3 ? (
        <>
          Top <strong>{books.length}</strong> books
        </>
      ) : (
        <>
          Found <strong>{books.length}</strong> books
        </>
      )}
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}

function BookList({ books, onSelectBook }) {
  return (
    <ul className="list list-movies">
      {books?.map((book) => (
        <BookListItem book={book} key={book.imdbID} onSelectBook={onSelectBook} />
      ))}
    </ul>
  );
}

function BookListItem({ book, onSelectBook }) {
  return (
    <li onClick={() => onSelectBook(book.imdbID)}>
      <img src={book.Poster} alt={`${book.Title} poster`} />
      <h3>{book.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{book.Year}</span>
        </p>
      </div>
    </li>
  );
}

function BookDetails({ selectedBookId, onCloseBook, onAddReadBook, readBooks }) {
  const [book, setBook] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating],
  );

  const isRead = readBooks.map((entry) => entry.imdbID).includes(selectedBookId);
  const readUserRating = readBooks.find((entry) => entry.imdbID === selectedBookId)?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: authors,
    Director: publisher,
    Genre: genre,
  } = book;

  function handleAdd() {
    const newReadBook = {
      imdbID: selectedBookId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number.parseInt(runtime, 10) || 0,
      userRating,
      countRatingDecisions: countRef.current,
    };

    onAddReadBook(newReadBook);
    onCloseBook();
  }

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onCloseBook();
        }
      }

      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onCloseBook],
  );

  useEffect(
    function () {
      async function getBookDetails() {
        setIsLoading(true);
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${selectedBookId}?key=${GOOGLE_BOOKS_KEY}`,
        );
        const data = await res.json();
        setBook(mapGoogleBookDetails(data));
        setIsLoading(false);
      }

      getBookDetails();
    },
    [selectedBookId],
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Book Finder | ${title}`;

      return function () {
        document.title = "Book Finder";
      };
    },
    [title],
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseBook}>
              &larr;
            </button>
            <img src={poster} alt={`Cover of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} Reader rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isRead ? (
                <>
                  <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to bookshelf
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this book {readUserRating} <span>⭐️</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Author: {authors}</p>
            <p>Publisher: {publisher}</p>
          </section>
        </>
      )}
    </div>
  );
}

function ReadBooksSummary({ readBooks }) {
  const avgImdbRating = average(readBooks.map((book) => book.imdbRating));
  const avgUserRating = average(readBooks.map((book) => book.userRating));
  const avgRuntime = average(readBooks.map((book) => book.runtime));

  return (
    <div className="summary">
      <h2>Books you read</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{readBooks.length} books</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} pages</span>
        </p>
      </div>
    </div>
  );
}

function ReadBooksList({ readBooks, onDeleteReadBook }) {
  return (
    <ul className="list">
      {readBooks.map((book) => (
        <ReadBookRow book={book} key={book.imdbID} onDeleteReadBook={onDeleteReadBook} />
      ))}
    </ul>
  );
}

function ReadBookRow({ book, onDeleteReadBook }) {
  return (
    <li>
      <img src={book.poster} alt={`${book.title} poster`} />
      <h3>{book.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{book.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{book.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{book.runtime} pages</span>
        </p>

        <button className="btn-delete" onClick={() => onDeleteReadBook(book.imdbID)}>
          X
        </button>
      </div>
    </li>
  );
}
