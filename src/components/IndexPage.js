// This is rendered when viewing the IndexRoute which is the component
// rendered when we are viewing the index page of the parent route
// In this case that is '/'

import React from 'react';
import Dice from './Dice';

export default class IndexPage extends React.Component {
  render() {
    return (
      <div className="home">
        index page I guess...to either join a game or create a game!!!
        buttons buttons all the buttons!!!
        <Dice />
      </div>
    );
  }
}