import React from 'react';

export class UnitDisplay extends React.Component {
	constructor(props) {
		super(props);
	}

	// These are taken from https://wow.gamepedia.com/Gallery_of_player_avatars
	getImagePathFromProps() {
		const { class: classId, race: raceId, gender: genderId, overrideImage, level } = this.props;
		if (overrideImage !== undefined) {
			return overrideImage;
		}

		if (classId === 0) {
			return '/img/player-icons/unknown.png';
		}

		const levelCategorization = (level === undefined || level < 60) ? 1 : 60;

		return `/img/player-icons/${classId}-${raceId}-${genderId}-${levelCategorization}.gif`
	}

	render() {
		const imgPath = this.getImagePathFromProps();

		const horizontalClass = this.props.twoColumnData ? 'double-column' : 'flex-column';
		const selectionClass = this.props.selected ? 'selected': '';

		return (
			<div className={`unit-display ${horizontalClass} ${selectionClass}`}>
				<div className="player-icon" style={{ backgroundImage: `url(${imgPath})` }}>
					{
						this.props.level === undefined ? <div/> : (
							<div className="level-circle">{this.props.level}</div>
						)}
				</div>

				<div className="data-list">
					<div>{this.props.name}</div>
					<div className="additional-data">{this.props.additionalData}</div>
				</div>
			</div>
		)
	}
}
