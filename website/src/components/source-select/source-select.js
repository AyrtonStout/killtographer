import React from 'react';
import {UnitDisplay} from "../unit-display/unit-display";

const EVENT_LIMITS = [
	200, 500, 1000, 1500, 2000, 3000, 4000, 5000, 10000
];

export class SourceSelect extends React.Component {
	constructor(props) {
		super(props);
	}

	selectSourcePlayer(sourcePlayerId) {
		if (sourcePlayerId === this.props.selectedSourcePlayerId) {
			return;
		}

		this.props.updateState({ selectedSourcePlayerId: sourcePlayerId });
	}

	render() {
		const totalEventCount = Object.values(this.props.sourcePlayerEventCount).reduce((totalCount, currentCount) => {
			return totalCount + currentCount;
		}, 0);

		return (
			<div id="source-select">

				<div>
					<span>Realm: </span>
					<select value={this.props.selectedRealm.id} onChange={e => this.props.updateState({ selectedRealm: e.target.value })}>
						{ this.props.realms.map(realm => {
							return <option key={realm.id} value={realm.id}>{ realm.name }</option>
						}) }
					</select>
				</div>
				<hr/>
				<h3>Event Source</h3>

				<div onClick={() => this.selectSourcePlayer(null)}>
					<UnitDisplay
						name={'All Realm Data'}
						overrideImage='/img/wow-icon.svg'
						twoColumnData={true}
						additionalData={`${totalEventCount} kill events`}
						selected={this.props.selectedSourcePlayerId === null}
					/>
				</div>

				{
					this.props.sourcePlayers
						.map(sourcePlayer => {
							const eventCount = this.props.sourcePlayerEventCount[sourcePlayer.id] + ' kill events';

							return (
								<div key={sourcePlayer.id} onClick={() => this.selectSourcePlayer(sourcePlayer.id)}>
									<UnitDisplay
										name={sourcePlayer.name}
										class={sourcePlayer.class}
										race={sourcePlayer.race}
										gender={sourcePlayer.gender}
										twoColumnData={true}
										additionalData={eventCount}
										selected={this.props.selectedSourcePlayerId === sourcePlayer.id}
									/>
								</div>
							)
						})}

				<hr/>
				<div className="filter-wrapper">
					<div className="flex-between">
						<span>Kill Events</span>
						<select
							defaultValue={200}
							value={this.props.killEventLimit}
							onChange={e => this.props.updateState({ killEventLimit: parseInt(e.target.value) })}
						>
							{ EVENT_LIMITS.map(limit => {
								return <option key={limit} value={limit}>{ limit }</option>
							}) }
						</select>
					</div>

					<div className="flex-between">
						<span>Position Events</span>
						<select
							defaultValue={500}
							value={this.props.positionEventLimit}
							onChange={e => this.props.updateState({ positionEventLimit: parseInt(e.target.value) })}
						>
							{ EVENT_LIMITS.map(limit => {
								return <option key={limit} value={limit}>{ limit }</option>
							}) }
						</select>
					</div>

					<div className="flex-between">
						<span>Show Kill Events</span>
						<input
							type="checkbox"
							checked={this.props.killsVisible}
							onChange={() => this.props.updateState({ killsVisible: !this.props.killsVisible })}
						/>
					</div>

					<div className="flex-between">
						<span>Show Position Events</span>
						<input
							type="checkbox"
							checked={this.props.positionsVisible}
							onChange={() => this.props.updateState({ positionsVisible: !this.props.positionsVisible })}
						/>
					</div>
				</div>
			</div>
		)
	}
}
