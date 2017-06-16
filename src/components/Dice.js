import React from 'react';

// Probably map the numbers to images of the dice?
const sides = {
    '1': {
        'one': 1,
    },
    '2': {
        'two': 2,
    },
    '3': {
        'three': 3,
    }
};

export default class Dice extends React.Component {
    render() {
        const dice_side = 'dice_side_1.jpg';

        return (
            <span className="dice">
                <img className="dice_image" src={`/img/${dice_side}`}/>
            </span>
        );
    }
}