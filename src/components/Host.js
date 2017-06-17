import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {browserHistory} from 'react-router';


export default class HostView extends React.Component {
    constructor() {
        super();
        this.state = {
            gameId: "",
            name: ""
        }

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
        const headers = new Headers({'Content-Type': 'application/json'});

        fetch("/api/hostGame", {
            method: "POST",
            redirect: "follow",
            headers: headers,
            body: JSON.stringify(this.state)
        })
        .then(response => {
            return response.json()
        }).then(j => {
            localStorage.setItem('userId', j.userId);
            browserHistory.push(`/lobby/${j.gameId}`);
        })

    }

    render() {
        return (
            <div className="host-view">
                <form onSubmit={this.handleSubmit}>
                    <div><TextField hintText="A Game Id" value={this.state.gameId} onChange={this.handleGameIdChange} fullWidth={true} /></div>
                    <div><TextField hintText="A Name" value={this.state.name} onChange={this.handleNameChange} fullWidth={true} /></div>
                    <div><RaisedButton type="submit" primary={true} label="host" fullWidth={true} /></div>
                </form>
            </div>
        );
    }
}