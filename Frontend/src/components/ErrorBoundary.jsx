import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };
  
  static getDerivedStateFromError(e) {
    return { error: e };
  }
  
  render() {
    if (this.state.error) {
      return (
        <div className="error-page">
          <h2>Something went wrong.</h2>
          <p>{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
