// import React, { useState, useEffect } from 'react';
// import BookCard from './BookCard';
// import axios from 'axios';
// import '../css/Books.css';

// const Books = ({role}) => {
//   const [books, setBooks] = useState([]);

//   useEffect(() => {
//     axios.get('http://localhost:3001/book/books')
//       .then(res => {
//         setBooks(res.data);
//         console.log(res.data);
//       })
//       .catch(err => console.log(err));
//   }, []);

//   return (
//     <div className='book-list'>
//       {books.length > 0 ? (
//         books.map(book => (
//           <BookCard key={book._id} book={book}  role={role}/>
//         ))
//       ) : (
//         <p>No books available</p>
//       )}
//     </div>
//   );
// };

// export default Books;


import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import axios from 'axios';
import '../css/Books.css';

const Books = ({ role }) => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [filteredBooks, setFilteredBooks] = useState([]); // State for filtered books
  const [searchBy, setSearchBy] = useState('name'); // State for dropdown (search by name or author)

  useEffect(() => {
    // Fetch the list of books from the backend
    axios.get('http://localhost:3001/book/books')
      .then(res => {
        setBooks(res.data);
        setFilteredBooks(res.data); // Initially set the filteredBooks to the full list of books
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    // Filter books based on the search query and the selected search criterion (name or author)
    const filtered = books.filter(book => {
      if (searchBy === 'name') {
        return book.name.toLowerCase().includes(searchQuery.toLowerCase());
      } else if (searchBy === 'author') {
        return book.author.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    });
    setFilteredBooks(filtered); // Update the filteredBooks state
  }, [searchQuery, searchBy, books]); // This will run when searchQuery, searchBy, or books change

  return (
    <div className='books-page'>
      <div className="search-bar">
        {/* Dropdown for selecting search criterion */}
        <select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          className="dropdown-select"
        >
          <option value="name">Search by Book Name</option>
          <option value="author">Search by Author Name</option>
        </select>

        {/* Search input */}
        <input
          type="text"
          placeholder={`Search by ${searchBy === 'name' ? 'Book Name' : 'Author Name'}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
          className="search-input"
        />
      </div>

      <div className='book-list'>
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <BookCard key={book._id} book={book} role={role} />
          ))
        ) : (
          <p>No books available</p>
        )}
      </div>
    </div>
  );
};

export default Books;

