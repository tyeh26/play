// This is rendered when viewing the IndexRoute which is the component
// rendered when we are viewing the index page of the parent route
// In this case that is '/'

import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Dice from './Dice';

export default class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameId: "",
            name: "",
        };

        this.handleGameIdChange = this.handleGameIdChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleGameIdChange(event) {
        this.setState({gameId: event.target.value});
    }

    handleNameChange(event) {
        this.setState({name: event.target.value});
    }

    handleSubmit(event) {
        console.log("join the game!");
        console.log(this.state);
        event.preventDefault();
    }

    render() {
        return (
            <div className="home">
                <div><Dice face="3" /></div>
                <form onSubmit={this.handleSubmit}>
                    <div><TextField id="gameId-field" hintText="Game Id" value={this.state.gameId} onChange={this.handleGameIdChange} /></div>
                    <div><TextField id="name-field" hintText="A Name" value={this.state.name} onChange={this.handleNameChange} /></div>
                    <div><RaisedButton type="submit" label="join" /></div>
                </form>
            </div>
        );
    }
}