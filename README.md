📚 Book Finder App
A web application that allows users to search for books, explore top-rated titles, and track their personal reading list.

This project was built for educational and portfolio purposes to practice modern React development, custom hooks, API integration, and state management.

🚀 Live Demo
👉 (add your Netlify/Vercel link here)

✨ Features
Search books using Google Books API
Display top-rated books by default
View detailed book information
Add books to personal "read" list
Rate books with a custom star rating system
Persistent data using Local Storage
Delete books from your list
Responsive and modern UI
Keyboard shortcuts (e.g. Enter, Escape)
Smooth UX with loading and error states

🛠 Tech Stack
React (Hooks, Functional Components)
JavaScript (ES6+)
HTML5
CSS3
Google Books API
Local Storage API

📦 Run Locally
Clone the repository:

git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git

Navigate into the project folder:

cd YOUR_REPO

Install dependencies:

npm install

Create a `.env` file in the root and add:

REACT_APP_GOOGLE_BOOKS_KEY=your_api_key_here

Start the development server:

npm start

⚙️ How It Works
The app fetches data from the Google Books API. :contentReference[oaicite:0]{index=0}  
If no search query is provided, it displays a curated list of top books. :contentReference[oaicite:1]{index=1}  
Users can search books dynamically based on input. :contentReference[oaicite:2]{index=2}  
Selecting a book fetches detailed information and displays it. :contentReference[oaicite:3]{index=3}  
Users can rate and save books to a personal list stored in Local Storage. :contentReference[oaicite:4]{index=4}  

📁 Project Structure
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

📡 External APIs & Libraries
Google Books API — https://developers.google.com/books

👤 Author
Martin Vukalović

📄 License
This project is intended for educational and portfolio purposes.
