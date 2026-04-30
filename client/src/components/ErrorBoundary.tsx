import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
          <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-sm shadow-sm text-center">
            <div className="text-4xl mb-3">🥗</div>
            <h1 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h1>
            <p className="text-sm text-gray-500 mb-5">An unexpected error occurred.</p>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 text-sm font-medium transition-colors"
            >
              Go back home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}