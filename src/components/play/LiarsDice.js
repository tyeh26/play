import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import {browserHistory} from 'react-router';


export default class LiarsDiceView extends React.Component {
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

    }

    componentWillUnmount() {
        
    }

    updateLobbyState(lobbyState) {
        this.setState({isHost: lobbyState.isHost});
    }

    handleNameChange(event) {
        this.setState({name: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch("/api/startGame", {
            method: "POST"
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
                    <ListItem primaryText="John" secondaryText="Host" />
                    <ListItem primaryText="foobar" />
                    <ListItem primaryText="Little Bobby Tables" />
                </List>
                <form onSubmit={this.handleSubmit}>
                    { this.state.isHost ? <div><RaisedButton type="submit" primary={true} label="start" fullWidth={true} /></div> : null }
                    <div><RaisedButton type="submit" secondary={false} label="exit" fullWidth={true} /></div>
                </form>
            </div>
        );
    }
}