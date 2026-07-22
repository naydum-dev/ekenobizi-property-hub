import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // In a future step we could send this to a logging service.
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReload = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-brand-green-deep mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We hit an unexpected error. Your data is safe — try reloading the
              page.
            </p>
            <button
              onClick={this.handleReload}
              className="bg-brand-green text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-green-deep transition"
            >
              Reload Ekenobizi Property Hub
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
