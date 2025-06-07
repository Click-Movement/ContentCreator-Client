'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

function NotFoundContent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-800 mb-4">404</h1>
        <h2 className="text-2xl font-medium text-slate-600 mb-6">Page not found</h2>
        <p className="mb-8 text-slate-500 max-w-md mx-auto">
          We could not find the page you were looking for. The page might have been removed or the URL might be incorrect.
        </p>
        <Button asChild>
          <Link href="/">Return to home</Link>
        </Button>
      </div>
    </div>
  );
}

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}