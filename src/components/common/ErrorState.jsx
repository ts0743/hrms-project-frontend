import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button'; // THIS WAS MISSING

const ErrorState = ({ message, onRetry, variant = "default" }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${variant === 'page' ? 'min-h-[400px]' : ''}`}>
      <div className="bg-red-50 p-4 rounded-full mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">Something went wrong</h3>
      <p className="text-slate-500 max-w-xs mx-auto mb-6 mt-2">
        {message || "We couldn't load the data. Please try again."}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState; 