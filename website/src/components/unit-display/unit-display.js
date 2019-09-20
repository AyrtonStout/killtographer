import React from 'react';

export class UnitDisplay extends React.Component {
	constructor(props) {
		super(props);
	}

	// These are taken from https://wow.gamepedia.com/Gallery_of_player_avatars
	getImageNameFromPlayerInfo(classId, raceId, genderId, level) {
		if (classId === 0) {
			return 'unknown.png';
		}

		const levelCategorization = (level === undefined || level < 60) ? 1 : 60;
		return `${classId}-${raceId}-${genderId}-${levelCategorization}.gif`
	}

	render() {
		const icon = this.getImageNameFromPlayerInfo(this.props.class, this.props.race, this.props.gender, this.props.level);

		const horizontalClass = this.props.twoColumnData ? '' : 'flex-column';
		return (
			<div className={`unit-display ${horizontalClass}`}>
				<div className="player-icon" style={{ backgroundImage: `url(./player-icons/${icon})` }}>
					{
						this.props.level === undefined ? <div/> : (
							<div className="level-circle">{this.props.level}</div>
						)}
				</div>

				<div>
					<div>{this.props.name}</div>
					<div className="additional-data">{this.props.additionalData}</div>
				</div>
			</div>
		)
	}
}
