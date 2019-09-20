import React from 'react';
import {UnitDisplay} from "../unit-display/unit-display";

export class KillFeed extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id="kill-feed">
				{ this.props.killEvents.map((killEvent, i) => {
					return (
						<div key={i} className="entity-section">
							<UnitDisplay
								name={killEvent.killer_name}
								level={killEvent.killer_level}
								class={killEvent.killer_class}
								race={killEvent.killer_race}
								gender={killEvent.killer_gender}
							/>
							<UnitDisplay
								name={killEvent.victim_name}
								level={killEvent.victim_level}
								class={killEvent.victim_class}
								race={killEvent.victim_race}
								gender={killEvent.victim_gender}
							/>
						</div>
					)
				})}
			</div>
		)
	}
}
