import React from 'react';
import {UnitDisplay} from "../unit-display/unit-display";

export class SourceSelect extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id="source-select">

				<div>
					<select value={this.props.selectedRealm.id}>
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
			</div>
		)
	}
}
