'use client';

import { useState } from 'react';
import AuthForm from '@/components/AuthForm';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <AuthForm
          mode={isLogin ? 'login' : 'register'}
          onToggleMode={() => setIsLogin(!isLogin)}
        />
      </div>
    </div>
  );
}
