// This is rendered when viewing the IndexRoute which is the component
// rendered when we are viewing the index page of the parent route
// In this case that is '/'

import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {browserHistory} from 'react-router';

export default class GuestView extends React.Component {
    constructor(props) {
        super(props);
        let user_id = "";
        let isNode = typeof module !== 'undefined';

        if (!isNode) {
            user_id = localStorage.getItem('userId') || "";
        }

        this.state = {
            gameId: "",
            name: user_id,
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
        const payload = {
            gameId: this.state.gameId,
            userId: localStorage.getItem('userId'),
            name: this.state.name
        };
        const headers = new Headers({'Content-Type': 'application/json'});

        fetch("/api/joinGame", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload) })
        .then(response => {
            return response.json()
        }).then(j => {
            localStorage.setItem('userId', j.userId);
            browserHistory.push(`/lobby/${j.gameId}`);
        })
    }

    render() {
        return (
            <div className="guest-view">
                <form onSubmit={this.handleSubmit}>
                    <div><TextField hintText="Game Id" value={this.state.gameId} onChange={this.handleGameIdChange} fullWidth={true} /></div>
                    <div><TextField hintText="A Name" value={this.state.name} onChange={this.handleNameChange} fullWidth={true} /></div>
                    <div><RaisedButton type="submit" primary={true} label="join" fullWidth={true} /></div>
                </form>
            </div>
        );
    }
}