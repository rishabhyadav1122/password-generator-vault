'use client';

import { useState } from 'react';
import { VaultItem as VaultItemType } from '@/types';
import { ObjectId } from 'mongodb';
import { Copy, Edit, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';

interface VaultItemProps {
  item: VaultItemType;
  onEdit: (item: VaultItemType) => void;
  onDelete: (id: string | ObjectId) => void;
}

export default function VaultItem({ item, onEdit, onDelete }: VaultItemProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const decryptText = (encryptedText: string) => {
    try {
      // In a real implementation, you'd use the encryption key here
      // For now, we'll assume the text is already decrypted
      return encryptedText;
    } catch (error) {
      console.error('Decryption error:', error);
      return '***';
    }
  };

  const decryptedPassword = decryptText(item.password);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">{item.title}</h3>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              {item.url}
            </a>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item._id!)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Username */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Username</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={item.username}
              readOnly
              className="flex-1 p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={() => handleCopy(item.username, 'username')}
              className={`px-3 py-2 rounded text-sm transition-colors ${
                copied === 'username'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
              }`}
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Password</label>
          <div className="flex gap-2">
            <input
              type={showPassword ? 'text' : 'password'}
              value={decryptedPassword}
              readOnly
              className="flex-1 p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm font-mono text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500 rounded text-sm transition-colors"
            >
              {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
            <button
              onClick={() => handleCopy(decryptedPassword, 'password')}
              className={`px-3 py-2 rounded text-sm transition-colors ${
                copied === 'password'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
              }`}
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Notes */}
        {item.notes && (
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Notes</label>
            <div className="flex gap-2">
              <textarea
                value={item.notes}
                readOnly
                rows={2}
                className="flex-1 p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm resize-none text-gray-900 dark:text-gray-100"
              />
              <button
                onClick={() => handleCopy(item.notes!, 'notes')}
                className={`px-3 py-2 rounded text-sm transition-colors ${
                  copied === 'notes'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
                }`}
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
