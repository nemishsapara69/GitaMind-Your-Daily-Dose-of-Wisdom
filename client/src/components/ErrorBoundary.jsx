import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          backgroundColor: '#FFF5DF',
          color: '#603900',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '3em', marginBottom: '20px', color: '#B06500' }}>
            🙏 Oops! Something went wrong
          </h1>
          <p style={{ fontSize: '1.2em', marginBottom: '30px', maxWidth: '600px' }}>
            We apologize for the inconvenience. An unexpected error occurred.
          </p>
          
          {import.meta.env.DEV && this.state.error && (
            <details style={{ 
              marginBottom: '30px', 
              padding: '20px', 
              backgroundColor: 'white', 
              borderRadius: '8px',
              maxWidth: '800px',
              textAlign: 'left',
              border: '1px solid #FFDDBC'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
                Error Details (Development Mode)
              </summary>
              <pre style={{ 
                whiteSpace: 'pre-wrap', 
                fontSize: '0.9em',
                color: '#d32f2f'
              }}>
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}

          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={this.handleReload}
              style={{
                padding: '12px 30px',
                fontSize: '1.1em',
                backgroundColor: '#B06500',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#9A5700'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#B06500'}
            >
              Reload Page
            </button>
            <button
              onClick={this.handleGoHome}
              style={{
                padding: '12px 30px',
                fontSize: '1.1em',
                backgroundColor: 'white',
                color: '#B06500',
                border: '2px solid #B06500',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#FFE9D5';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
              }}
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
