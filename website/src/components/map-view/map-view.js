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
		return (
			<div
				id="viewed-map"
				style={{ backgroundImage: `url("./maps/${this.props.mapId}.jpg")` }}
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
				<div id="kill-location-container">
					{ this.props.killEvents.map((killEvent, i) => {
						const x = killEvent.x * 100 + '%';
						const y = killEvent.y * 100 + '%';
						return <div key={i} className="kill-location" style={{ left: x, top: y}}/>
					})}
				</div>
			</div>
		)
	}
}
