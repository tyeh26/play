import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
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
            nextPlayers: [],
            wagerNumberOfDie: 1,
            wagerFace: null,
            openBadWagerDialog: false,
        }
    }

    componentDidMount() {
        let userId = localStorage.getItem('userId');

        if (!this.props.params.gameId || !userId) {
            browserHistory.push("/");
        }

        this.setState({userId: userId});
        this.updateGameState = this.updateGameState.bind(this);
        this.handleChallenge = this.handleChallenge.bind(this);
        this.handleWager = this.handleWager.bind(this);
        this.handleWagerNumberOfDieChange = this.handleWagerNumberOfDieChange.bind(this);
        this.handleWagerFaceChange = this.handleWagerFaceChange.bind(this);
        this.handleCloseBadwagerDialog = this.handleCloseBadwagerDialog.bind(this);
        this.updateGameState();
        let refreshGameInterval = setInterval(this.updateGameState, 300);
        this.setState({refreshGameInterval:refreshGameInterval});
    }

    componentWillUnmount() {
        this.state.refreshGameInterval && clearInterval(this.state.refreshGameInterval);
        this.setState({refreshGameInterval: null});
    }

    updateGameState(lobbyState) {
        fetch(`/api/gamestatus?userId=${this.state.userId}&gameId${this.state.gameId}`)
        .then(response => { return response.json() })
        .then(j => {
            this.setState({players: j.players});
            this.setState({rolledFaces: j.rolledFaces});
            this.setState({wagers: j.wagers});
            this.setState({myTurn: j.currentPlayer == this.state.userId});
            let me = j.players[this.state.userId];
            let playerOrder = []; // user Ids in order
            Object.keys(j.players).map( (userId) =>
                playerOrder[j.players[userId].order] = userId
            );

            let currentPlayerOrder = j.players[j.currentPlayer].order;
            let nextPlayers = playerOrder.slice(currentPlayerOrder).concat(playerOrder.slice(0, currentPlayerOrder));
            this.setState({nextPlayers: nextPlayers});

            //this.setState({wagerNumberOfDie: j.wagers.length < 1 ? 1 : j.wagers[j.wagers.length - 1].numberOfDie});
            //this.setState({wagerFace: j.wagers.length < 1 ? 1 : j.wagers[j.wagers.length - 1].face});
        })
    }

    handleChallenge(event) {
        event.preventDefault();

        const payload = { gameId: this.state.gameId, userId: this.state.userId }

        fetch('/api/challenge', {
            method: "POST",
            body: JSON.stringify(payload)
        })
    }

    handleWager(event) {
        event.preventDefault();

        let lastWager = this.state.wagers[this.state.wagers.length - 1]

        if (this.state.wagerFace <= this.lastWager.face && this.state.wagerNumberOfDie <= this.lastWager.numberOfDie) {
            this.setState({openBadWagerDialog: true});
        } else {
            const payload = { gameId: this.state.gameId, userId: this.state.userId, numberOfDie: this.state.wagerNumberOfDie, face: this.state.wagerFace }

            fetch('/api/wager', {
                method: "POST",
                body: JSON.stringify(payload)
            })
        }
    }

    handleWagerNumberOfDieChange(event, index, value) {
        this.setState({wagerNumberOfDie:value})
    }

    handleWagerFaceChange(event, index, value) {
        this.setState({wagerFace:value})
    }

    handleCloseBadwagerDialog() {
        this.setState({openBadWagerDialog: false});
    }

    render() {
        let rowsOfWhatever = [];
        for (var i =0; i < 101; i++) {
            rowsOfWhatever.push(<MenuItem value={i} primaryText={i}/>)
        }
        return (
            <div className="host-view">
                <List style={{maxHeight: 300, overflow: 'auto'}}>
                    {this.state.wagers.map( (wager) =>
                        <ListItem
                            primaryText={this.state.players[wager.userId].name}
                            leftIcon={<span>{wager.numberOfDie} X <Dice size="small-dice" face={wager.face} /></span>}
                        />
                    )}
                    <Divider />
                    {this.state.nextPlayers.map( (userId) =>
                        <ListItem
                            primaryText={`${this.state.players[userId].name} (${this.state.players[userId].numberOfDie})`}
                            insetChildren={true}
                        />
                    )}
                </List>
                <div>
                    {this.state.rolledFaces.map( (face) =>
                       <Dice face={face} size="large-dice" isRolling={this.state.isRolling} />
                    )}
                </div>
                {this.state.myTurn ?
                    <form onSubmit={this.handlewager}>
                    <DropDownMenu value={this.state.wagerNumberOfDie} onChange={this.handleWagerNumberOfDieChange}>
                        {rowsOfWhatever}
                    </DropDownMenu>
                    X
                    <DropDownMenu value={this.state.wagerFace} onChange={this.handleWagerFaceChange}>
                        <MenuItem value={1} primaryText="1" />
                        <MenuItem value={2} primaryText="2" />
                        <MenuItem value={3} primaryText="3" />
                        <MenuItem value={4} primaryText="4" />
                        <MenuItem value={5} primaryText="5" />
                        <MenuItem value={6} primaryText="6" />
                    </DropDownMenu>
                    <div><RaisedButton type="submit" primary={true} label="wager" fullWidth={true} /></div>
                    </form>
                : null}
                {this.state.wagers.length > 0 && this.state.userId != this.state.wagers[this.state.wagers.length - 1].userId ?
                    <form onSubmit={this.handleChallenge}>
                        <div><RaisedButton type="submit" secondary={true} label="challenge" fullWidth={true} /></div>
                    </form>
                : null}
                <Dialog
                    title="No no no no!"
                    actions={<RaisedButton label="Close" primary={true} onTouchTap={this.handleCloseBadwagerDialog} />}
                    modal={true}
                    open={this.state.openBadWagerDialog}>
                        You can't wager that!
                </Dialog>
            </div>
        );
    }
}