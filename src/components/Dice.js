import React from 'react';

export default class Dice extends React.Component {

    render() {
        return (
            <span className="dice">
                <img className="dice_image" src={`/static/img/dice-${this.props.face}.svg`}/>
            </span>
        );
    }
}