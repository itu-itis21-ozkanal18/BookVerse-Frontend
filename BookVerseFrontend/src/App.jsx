import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import FooterComponent from './components/FooterComponent';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import BookPage from './pages/BookPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SearchPage from './pages/SearchPage';
import CategoryPage from './pages/CategoryPage';
import AuthorPage from './pages/AuthorPage';
import ProfilePage from './pages/ProfilePage';

import AdminLayout from './admin/AdminLayout';
import AdminBooksPage from './admin/AdminBooksPage';
import AdminUsersPage from './admin/AdminUsersPage';
import AdminUserCommentsPage from './admin/AdminUserCommentsPage';
import AdminCategoriesPage from './admin/AdminCategoriesPage';
import AdminAuthorsPage from './admin/AdminAuthorsPage';
import AdminRoute from './admin/AdminRoute';

import '../index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/book/:bookId" element={<BookPage />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/author/:authorId" element={<AuthorPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/logout" element={<Navigate to="/login" />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="books" element={<AdminBooksPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="comments" element={<AdminUserCommentsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="authors" element={<AdminAuthorsPage />} />
          </Route>
        </Route>
      </Routes>
      <FooterComponent />
    </Router>
  );
}

export default App;
