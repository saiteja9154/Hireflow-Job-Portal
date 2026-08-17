import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 max-w-md mx-4 text-center">
        <div className="flex flex-col items-center mb-4">
          <AlertCircle className="h-12 w-12 text-slate-400 mb-2" />
          <h1 className="text-2xl font-bold text-slate-950">
            Page Not Found
          </h1>
        </div>

        <p className="text-sm text-slate-500 mb-6">
          We couldn't find the page you were looking for. It might have been moved or doesn't exist yet.
        </p>

        <Link to="/" className="button button-primary inline-flex items-center gap-2 justify-center w-full">
          <ArrowLeft size={16} /> Return to Home
        </Link>
      </div>
    </div>
  );
}
