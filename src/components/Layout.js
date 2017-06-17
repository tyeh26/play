// Layout page that is used in every section of application
// Components defined in the nested routes will be rendered inside
// this Layout component in place of the this.props.children property
import React from 'react';
import { Link } from 'react-router';

export default class Layout extends React.Component {
    render() {
        return (
            <div className="app-container">
                <header>
                </header>
                <div className="app-content">{this.props.children}</div>
                <footer>
                    <p id="footer">
                        ATP (c) 2017
                    </p>
                </footer>
            </div>
        );
  }
}