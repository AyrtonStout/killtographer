import React from 'react';
import {getMapSvgsForId} from "../../services/map-data";

export class MapView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {}
	}

	componentDidMount() {

	}

	render() {
		const killsClass = this.props.killsVisible ? '' : 'hidden';
		const positionsClass = this.props.positionsVisible ? '' : 'hidden';

		return (
			<div
				id="viewed-map"
				style={{ backgroundImage: `url("./img/maps/${this.props.mapId}.jpg")` }}
        onContextMenu={(e) => {
        	e.preventDefault();
        	this.props.undoMapLoad();
        }}
			>
				<svg id="map-svg" className="hover-path" height="668" width="1002">
					{ getMapSvgsForId(this.props.mapId).map((mapLink, i) => {
						return <path key={i} d={mapLink.coordinates} onClick={() => this.props.loadMap(mapLink.goesTo)}/>
					})}
				</svg>

				<div id="position-location-container" className={`location-container ${positionsClass}`}>
					{ this.props.positionEvents.map((positionEvent, i) => {
						const x = positionEvent.x * 100 + '%';
						const y = positionEvent.y * 100 + '%';
						return <div key={i} className="position-location event-location" style={{ left: x, top: y}}/>
					})}
				</div>

				<div id="kill-location-container" className={`location-container ${killsClass}`}>
					{ this.props.killEvents.map((killEvent, i) => {
						const x = killEvent.x * 100 + '%';
						const y = killEvent.y * 100 + '%';
						return <div key={i} className="kill-location event-location" style={{ left: x, top: y}}/>
					})}
				</div>
			</div>
		)
	}
}
