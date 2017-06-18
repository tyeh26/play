import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
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
            players: [],
            refreshLobbyInterval: null,
        }
    }

    componentDidMount() {
        let userId = localStorage.getItem('userId');

        if (!this.props.params.gameId || !userId) {
            browserHistory.push("/");
        }

        this.setState({userId: userId});

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateLobbyState = this.updateLobbyState.bind(this);
        this.updateLobbyState();
        let refreshLobbyInterval = setInterval(this.updateLobbyState, 500);
        this.setState({refreshLobbyInterval:refreshLobbyInterval});
    }

    componentWillUnmount() {
        this.state.refreshLobbyInterval && clearInterval(this.state.refreshLobbyInterval);
        this.setState({refreshLobbyInterval: null});
    }

    updateLobbyState() {
        fetch(`/api/gamestatus?userId=${this.state.userId}&${this.state.gameId}`)
        .then(response => {
            return response.json()
        }).then(j => {
            this.setState({players: j.players});
            let me = j.players[this.state.userId];
            this.setState({isHost: me.isHost});
        });
    }

    handleNameChange(event) {
        this.setState({name: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

        const payload = { gameId: this.state.gameId, userId: this.state.userId }

        fetch("/api/startGame", {
            method: "POST",
            body: JSON.stringify(payload),
            redirect: 'follow',
        }).then(response => {
            return response.json()
        }).then(j => {
            browserHistory.push(`/play/liarsdice/${j.gameId}`);
        })

    }

    render() {
        return (
            <div className="host-view">
                <List>
                    {Object.keys(this.state.players).map( (userId) =>
                        <ListItem key={userId} primaryText={this.state.players[userId].name}
                        secondaryText={this.state.players[userId].isHost ? "Host" : "" } />
                    )}
                </List>
                <form onSubmit={this.handleSubmit}>
                    { this.state.isHost ? <div><RaisedButton type="submit" primary={true} label="start" fullWidth={true} /></div> : null }
                    <div><RaisedButton type="submit" secondary={false} label="exit" fullWidth={true} /></div>
                </form>
            </div>
        );
    }
}