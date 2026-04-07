# 📚 Book Finder App

A web application that allows users to search for books, explore top-rated titles, and manage their personal reading list.

This project was built for educational and portfolio purposes to practice modern React development, custom hooks, API integration, and state management.

---

## 🚀 Live Demo

👉 https://book-finder-app-mv.netlify.app/

---

## ✨ Features

- Search books using Google Books API
- Display top-rated books by default
- View detailed book information
- Add books to personal "read" list
- Rate books using a custom star rating component
- Persistent data using Local Storage
- Delete books from the list
- Responsive and modern UI
- Keyboard interactions (Enter to focus search, Escape to close details)
- Loading and error state handling

---

## 🛠 Tech Stack

- React (Hooks, Functional Components)
- JavaScript (ES6+)
- HTML5
- CSS3
- Google Books API
- Local Storage API

## ⚙️ How It Works

1. The app fetches data from the Google Books API.
2. If no search query is entered, it displays a curated list of top books.
3. When the user types at least 3 characters, a search request is triggered.
4. Selecting a book loads detailed information.
5. Users can rate and add books to their personal list.
6. The list is stored in Local Storage and persists after reload.

---

## 📁 Project Structure

```
Book_Finder/
├── src/
│   ├── App.js
│   ├── index.js
│   ├── index.css
│   ├── StarRating.js
│   ├── useBooks.js
│   ├── useTopBooks.js
│   ├── useLocalStorageState.js
│   ├── useKey.js
│   ├── bookUtils.js
├── public/
├── .env
├── package.json
└── README.md
```

---

## 📡 External APIs & Libraries

- Google Books API — https://developers.google.com/books

---

## 👤 Author

Martin Vukalović

---

## 📄 License

This project is intended for educational and portfolio purposes.
