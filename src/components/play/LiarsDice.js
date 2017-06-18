import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import {browserHistory} from 'react-router';
import Dice from '../Dice';


export default class LiarsDiceView extends React.Component {
    constructor(props) {
        super(props);
        let isNode = typeof module !== 'undefined';
        let gameId = this.props.params.gameId;

        this.state = {
            players: [],
            gameId: gameId,
            userId: "",
            rolledFaces: [],
            isRolling: false,
            wagers: [],
        }
    }

    componentDidMount() {
        let userId = localStorage.getItem('userId');

        if (!this.props.params.gameId || !userId) {
            browserHistory.push("/");
        }

        this.setState({userId: userId});
        this.updateGameState = this.updateGameState.bind(this);
        this.handleSubmit = this.handleSubmit;
        this.updateGameState();
        let refreshGameInterval = setInterval(this.updateGameState, 300);
        this.setState({refreshGameInterval:refreshGameInterval});
    }

    componentWillUnmount() {
        this.state.refreshGameInterval && clearInterval(this.state.refreshGameInterval);
        this.setState({refreshGameInterval: null});
    }

    updateGameState(lobbyState) {
        fetch(`/api/gamestatus?userId=${this.state.userId}&${this.state.gameId}`)
        .then(response => { return response.json() })
        .then(j => {
            this.setState({players: j.players});
            this.setState({rolledFaces: j.rolledFaces});
            this.setState({wagers: j.wagers});
            let me = j.players[this.state.userId];
        })
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            <div className="host-view">
                <List style={{maxHeight: 300, overflow: 'auto'}}>
                    {this.state.wagers.map( (wager) =>
                        <ListItem
                            primaryText={`${this.state.players[wager.userId].name} (${this.state.players[wager.userId].numberOfDie})`}
                            secondaryText={<span>{wager.numberOfDie} X <Dice size="small-dice" face={wager.face} /></span>}
                        />
                    )}
                </List>
                <div>
                    {this.state.rolledFaces.map( (face) =>
                       <Dice face={face} isRolling={this.state.isRolling} />
                    )}
                </div>
                <form onSubmit={this.handleSubmit}>
                    <div><RaisedButton type="submit" primary={true} label="challenge" fullWidth={true} /></div>
                </form>
            </div>
        );
    }
}