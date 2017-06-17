// This is rendered when viewing the IndexRoute which is the component
// rendered when we are viewing the index page of the parent route
// In this case that is '/'

import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Dice from './Dice';

export default class GuestView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameId: "",
            name: "",
            faces: [1, 2, 3, 5, 5],
            isRolling: false,
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
        event.preventDefault();
        console.log("join the game!");
        console.log(this.state);
        this.setState({isRolling: true});
    }

    render() {
        return (
            <div className="guest-view">
                <div>
                    <Dice face={this.state.faces[0]} isRolling={this.state.isRolling} />
                    <Dice face={this.state.faces[1]} isRolling={this.state.isRolling} />
                    <Dice face={this.state.faces[2]} isRolling={this.state.isRolling} />
                </div>
                <form onSubmit={this.handleSubmit}>
                    <div><TextField hintText="Game Id" value={this.state.gameId} onChange={this.handleGameIdChange} fullWidth={true} /></div>
                    <div><TextField hintText="A Name" value={this.state.name} onChange={this.handleNameChange} fullWidth={true} /></div>
                    <div><RaisedButton type="submit" primary={true} label="join" fullWidth={true} /></div>
                </form>
            </div>
        );
    }
}