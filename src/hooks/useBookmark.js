import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiurl } from '../api';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';

export const useBookmark = (itemType, itemId) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);
  const { user } = useContext(UserContext)
  const getAuthConfig = (extra = {}) => {
    const token = localStorage.getItem('token');
    return {
      withCredentials: true,
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
      ...extra,
    };
  };

  // Check if item is bookmarked
  const checkBookmarkStatus = async () => {
    if (!itemId) return;

    try {
      const response = await axios.get(
        `${apiurl}/api/bookmarks/check`,
        getAuthConfig({ params: { itemType, itemId } })
      );
      setIsBookmarked(response.data.bookmarked);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  // Toggle bookmark (add/remove)
  const toggleBookmark = async () => {
    if (!itemId) return;

    if(!user){
      toast.error("To Bookmark Please login")
    } 
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiurl}/api/bookmarks`,
        { itemType, itemId },
        getAuthConfig()
      );

      if (response.data.removed) {
        setIsBookmarked(false);
        setBookmarkId(null);
      } else {
        setIsBookmarked(true);
        setBookmarkId(response.data._id || null);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get all bookmarks for a user
  const getBookmarks = async (type = null) => {
    try {
      const params = type ? { type } : {};
      const response = await axios.get(
        `${apiurl}/api/bookmarks`,
        getAuthConfig({ params })
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      return [];
    }
  };

  // Remove bookmark by ID
  const removeBookmark = async (id) => {
    try {
      await axios.delete(
        `${apiurl}/api/bookmarks/${id}`,
        getAuthConfig()
      );
      setIsBookmarked(false);
      setBookmarkId(null);
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  useEffect(() => {
    checkBookmarkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, itemType]);

  return {
    isBookmarked,
    loading,
    bookmarkId,
    toggleBookmark,
    checkBookmarkStatus,
    getBookmarks,
    removeBookmark,
  };
};
