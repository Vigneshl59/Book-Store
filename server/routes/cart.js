import express from 'express';
import { verifyStudent } from '../routes/auth.js'; // Adjust path as needed
import { Cart } from '../models/Cart.js'; // Adjust path as needed
import { Book } from '../models/Book.js'; // Adjust path as needed
// import { Student } from '../models/Student.js'; // Add this if you need student details

const router = express.Router();
router.post('/add-to-cart', verifyStudent, async (req, res) => {
  try {
    const studentId = req.user._id; 
    const { bookId } = req.body;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    let cart = await Cart.findOne({ studentId });
    if (!cart) {
      cart = new Cart({ studentId, books: [bookId] });
      await cart.save();
    } else {
      if (cart.books.includes(bookId)) {
        return res.status(400).json({ message: 'Book already in cart' });
      }
      cart.books.push(bookId);
      await cart.save();
    }
    res.status(200).json({ message: 'Book added to cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/', verifyStudent, async (req, res) => {
  try {
    const studentId = req.user._id;
    const cart = await Cart.findOne({ studentId }).populate('books');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json({
      name: req.user.username, 
      books: cart.books
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/buy', verifyStudent, async (req, res) => {
    try {
      const studentId = req.user._id;
      const { bookId } = req.body;
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      if (book.quantity <= 0) {
        return res.status(400).json({ message: 'Book out of stock' });
      }
      book.quantity -= 1;
      await book.save();
      await Cart.updateOne(
        { studentId },
        { $pull: { books: bookId } }
      );
  
      res.status(200).json({ message: 'Purchase successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  router.post('/remove-from-cart', verifyStudent, async (req, res) => {
    try {
      const studentId = req.user._id;
      const { bookId } = req.body;
      const cart = await Cart.findOne({ studentId });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      if (!cart.books.includes(bookId)) {
        return res.status(400).json({ message: 'Book not in cart' });
      }
  
      cart.books.pull(bookId);
      await cart.save();
  
      res.status(200).json({ message: 'Book removed from cart' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

export { router as cartRouter };
