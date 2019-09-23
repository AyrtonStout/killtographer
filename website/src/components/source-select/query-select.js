import React from 'react';
import {UnitDisplay} from "../unit-display/unit-display";

const EVENT_LIMITS = [
	200, 500, 1000, 1500, 2000, 3000, 4000, 5000, 10000
];

function test() {
	console.log('hey');
}

export class QuerySelect extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id="source-select">

				<div>
					<span>Realm</span>
					<select value={this.props.selectedRealm.id} onChange={e => this.props.updateState({ selectedRealm: e.target.value })}>
						{ this.props.realms.map(realm => {
							return <option key={realm.id} value={realm.id}>{ realm.name }</option>
						}) }
					</select>
				</div>

				{
					this.props.sourcePlayers
						.filter(sourcePlayer => sourcePlayer.realm_id === this.props.selectedRealm.id)
						.map(sourcePlayer => {
							const eventCount = this.props.sourcePlayerEventCount[sourcePlayer.id] + ' kill events';

							return (
								<div key={sourcePlayer.id}>
									<UnitDisplay
										name={sourcePlayer.name}
										class={sourcePlayer.class}
										race={sourcePlayer.race}
										gender={sourcePlayer.gender}
										twoColumnData={true}
										additionalData={eventCount}
									/>
								</div>
							)
						})}

				<div>
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

				<div>
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

        <div>
					<span>Show Kill Events</span>
					<input
						type="checkbox"
						checked={this.props.killsVisible}
						onChange={() => this.props.updateState({ killsVisible: !this.props.killsVisible })}
					/>
				</div>

				<div>
					<span>Show Position Events</span>
					<input
						type="checkbox"
						checked={this.props.positionsVisible}
						onChange={() => this.props.updateState({ positionsVisible: !this.props.positionsVisible })}
					/>
				</div>
			</div>
		)
	}
}
