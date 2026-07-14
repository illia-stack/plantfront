//Avoid one error to crach the entire App

import React from "react";


class ErrorBoundary extends React.Component {

    state = { hasError: false };

    static getDerivedStateFromError() {

      return { hasError: true };

    }

    componentDidCatch(error, info) {

      console.log("App crashed", error, info);

    }

    render() {

      if(this.state.hasError === true) {

        return (
          <div>
            <h2>Something went wrong</h2>
            <button onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        );

      }

      return this.props.children;

    }
}


export default ErrorBoundary;