'use client';

import { useState, useEffect } from 'react';
import { VaultItem, VaultItemFormData } from '@/types';
import { ObjectId } from 'mongodb';
import { encrypt, decrypt, generateEncryptionKey } from '@/lib/encryption';
import VaultItemComponent from './VaultItem';
import VaultForm from './VaultForm';
import PasswordGenerator from './PasswordGenerator';
import DarkModeToggle from './DarkModeToggle';
import { Plus, Search, LogOut, Key } from 'lucide-react';

export default function VaultInterface() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<VaultItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [encryptionKey, setEncryptionKey] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Initialize encryption key (in production, this should be derived from user's master password)
  useEffect(() => {
    const key = generateEncryptionKey();
    setEncryptionKey(key);
  }, []);

  // Fetch vault items
  useEffect(() => {
    fetchItems();
  }, []);

  // Filter items based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.url && item.url.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, items]);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/vault', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      } else if (response.status === 401) {
        // User not authenticated, show error
        setError('Please log in to access your vault');
        return;
      } else {
        setError('Failed to load vault items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Network error while loading vault');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: VaultItemFormData) => {
    try {
      // Encrypt sensitive data on the client side
      const encryptedData = {
        ...formData,
        password: encrypt(formData.password, encryptionKey),
        username: encrypt(formData.username, encryptionKey),
        notes: formData.notes ? encrypt(formData.notes, encryptionKey) : '',
      };

      const url = editingItem ? `/api/vault/${editingItem._id}` : '/api/vault';
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(encryptedData),
        credentials: 'include',
      });

      if (response.ok) {
        await fetchItems();
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleEdit = (item: VaultItem) => {
    // Decrypt the item for editing
    const decryptedItem = {
      ...item,
      password: decrypt(item.password, encryptionKey),
      username: decrypt(item.username, encryptionKey),
      notes: item.notes ? decrypt(item.notes, encryptionKey) : '',
    };
    setEditingItem(decryptedItem);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string | ObjectId) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`/api/vault/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (response.ok) {
          await fetchItems();
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include',
      });
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your vault...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg max-w-md">
            <h2 className="text-lg font-semibold mb-2">Authentication Required</h2>
            <p className="mb-4">{error}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Key className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Secure Vault</h1>
            </div>
            <div className="flex items-center gap-3">
              <DarkModeToggle />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Password Generator */}
          <div className="lg:col-span-1">
            <PasswordGenerator />
          </div>

          {/* Vault Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Your Vault</h2>
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search your vault..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="p-6">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Key className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm ? 'No items match your search.' : 'Your vault is empty. Add your first item!'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredItems.map((item) => (
                      <VaultItemComponent
                        key={item._id?.toString()}
                        item={item}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vault Form Modal */}
      {isFormOpen && (
        <VaultForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
          editingItem={editingItem}
        />
      )}
    </div>
  );
}
