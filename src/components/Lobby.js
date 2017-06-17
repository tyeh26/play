import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {browserHistory} from 'react-router';


export default class LobbyView extends React.Component {
    constructor(props) {
        super(props);
        let isNode = typeof module !== 'undefined';
        let gameId = this.props.params.gameId;

        this.state = {
            gameId: gameId,
            userId: "",
            name: "",
            isHost: false,
        }
    }

    componentDidMount() {
        let userId = localStorage.getItem('userId') || "";

        if (!this.props.params.gameId || userId) {
            browserHistory.push("/");
        }

        if(userId) {
            this.setState({
                userId: user_id,
            });

            {/* Eventually, query Lobby or Game State  */}
            fetch(`/api/gamestatus?userId=${this.state.userId}`)
            .then(response => {
                return response.json()
            }).then(j => {
                this.updateLobbyState(j)
            });
        }
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateLobbyState = this.updateLobbyState.bind(this);
    }

    updateLobbyState(lobbyState) {
        this.setState({isHost: lobbyState.isHost});
    }

    handleNameChange(event) {
        this.setState({name: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch("/api/killpeople", {
            method: "POST",
            body: JSON.stringify(this.state) })
        .then(response => {
                return response.json()
        }).then(j => {
            localStorage.setItem('userId', j.userId);
            browserHistory.push("/");
        })

    }

    render() {
        return (
            <div className="host-view">
                <form onSubmit={this.handleSubmit}>
                    <div><TextField hintText="A Game Id" value={this.state.gameId} onChange={this.handleGameIdChange} fullWidth={true} /></div>
                    <div><TextField hintText="A Name" value={this.state.name} onChange={this.handleNameChange} fullWidth={true} /></div>

                    { this.state.isHost ? <div><RaisedButton type="submit" primary={true} label="start" fullWidth={true} /></div> : null }
                </form>
            </div>
        );
    }
}