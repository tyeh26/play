import React from 'react';
import Dice from './Dice';

export default class GuestView extends React.Component {
	render() {
		return (
			<div className="guest-view">
				<Dice face="3"/>
			</div>	
		);
	}
}