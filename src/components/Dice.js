import React from 'react';

export default class Dice extends React.Component {
   constructor(props) {
        super(props);
        this.state = {
            rollFace: null,
        };
    }

    componentDidMount() {
        this.rollInterval = setInterval(() => {
            if (!this.props.isRolling) {
                this.setState({rollFace: null})
            } else if (Math.random() > 0.4) {
                this.setState({rollFace: Math.floor(Math.random() * 6 + 1)})
            }
        }, 300);
    }

    componentWillUnmount () {
        this.rollInterval && clearInterval(this.rollInterval);
        this.rollInterval = false;
    }

    render() {
        if (this.state.rollFace || this.props.face) {
            return (

                <span className="dice">
                    <img className="dice-image" src={`/static/img/dice-${this.state.rollFace || this.props.face}.svg`}/>
                </span>
            )
        } else {
            return null
        }
    }
}