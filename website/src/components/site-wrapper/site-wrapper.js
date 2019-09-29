import React from 'react';
import {Slide, ToastContainer} from "react-toastify";
import {Api} from "../../services/api";
import {MapView} from "../map-view/map-view";
import {KillFeed} from "../kill-feed/kill-feed";
import {SourceSelect} from "../source-select/source-select";

export class SiteWrapper extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mapId: 947,
			selectedSourcePlayerId: null,
			sourcePlayers: [],
			sourcePlayerKillEventCount: {},
			sourcePlayerPositionEventCount: {},
			previousMapIds: [],
			killEvents: [],
			realms: [],
			selectedRealm: {},
			positionEvents: [],
			killEventLimit: 200,
			positionEventLimit: 500,
			killsVisible: true,
			positionsVisible: true
		}
	}

	componentDidMount() {
		this.fetchRealms();
		this.fetchKillEvents(this.state.mapId);
		this.fetchPositionEvents(this.state.mapId);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.state.killEventLimit !== prevState.killEventLimit) {
			this.fetchKillEvents(this.state.mapId);
		} else if (this.state.positionEventLimit !== prevState.positionEventLimit) {
			this.fetchPositionEvents(this.state.mapId);
		} else if (this.state.selectedRealm.id !== prevState.selectedRealm.id) {
			this.fetchSourcePlayers(this.state.selectedRealm);
		} else if (this.state.selectedSourcePlayerId !== prevState.selectedSourcePlayerId) {
			this.fetchKillEvents(this.state.mapId);
			this.fetchPositionEvents(this.state.mapId);
		}
	}

	fetchSourcePlayers(selectedRealm) {
		Api.get('sources', { realmId: selectedRealm.id }).then(res => this.setState({ sourcePlayers: res }) );

		Api.get('sources/kill-event-count', { realmId: selectedRealm.id }).then(res => {
			const playerIdToEventCount = {};

			res.forEach(entry => {
				playerIdToEventCount[entry.source_player_id] = entry.count;
			});

			this.setState({ sourcePlayerKillEventCount: playerIdToEventCount })
		});

		Api.get('sources/position-event-count', { realmId: selectedRealm.id }).then(res => {
			const playerIdToEventCount = {};

			res.forEach(entry => {
				playerIdToEventCount[entry.source_player_id] = entry.count;
			});

			this.setState({ sourcePlayerPositionEventCount: playerIdToEventCount })
		});
	}

	fetchRealms() {
		Api.get('realms').then(realms => {
			// Make Grobbulus the default because Grob best realm
			const grobbulus = realms.find(realm => realm.name === 'Grobbulus');

			let realmToSet;
			if (grobbulus) {
				realmToSet = grobbulus;
			} else if (realms.length > 0) {
				realmToSet = realms[0];
			} else {
				realmToSet = {};
			}

			this.setState({ realms, selectedRealm: realmToSet });
		})
	}

	fetchKillEvents(mapId) {
		const params = {
			mapId: mapId,
			isInstance: false,
			eventLimit: this.state.killEventLimit
		};

		if (this.state.selectedSourcePlayerId != null) {
			params.sourcePlayerId = this.state.selectedSourcePlayerId
		}

		this.setState({ killEvents: [] });

		Api.get('kill-events', params).then(res => this.setState({ killEvents: res }) );
	}

	fetchPositionEvents(mapId) {
		const params = {
			mapId: mapId,
			eventLimit: this.state.positionEventLimit
		};

		if (this.state.selectedSourcePlayerId != null) {
			params.sourcePlayerId = this.state.selectedSourcePlayerId
		}

		this.setState({ positionEvents: [] });

		Api.get('position-events', params).then(res => this.setState({ positionEvents: res }) );
	}

	loadMap(mapId) {
		const previousMapIds = this.state.previousMapIds.slice(0);
		previousMapIds.push(this.state.mapId);

		this.setState({ mapId, previousMapIds });

		this.fetchKillEvents(mapId);
		this.fetchPositionEvents(mapId);
	}

	undoMapLoad() {
		if (this.state.previousMapIds.length === 0) {
			return;
		}

		const previousMapIds = this.state.previousMapIds.slice(0);
		const lastMapId = previousMapIds.pop();

		this.setState({ mapId: lastMapId, previousMapIds, killEvents: [] });
		this.fetchKillEvents(lastMapId);
		this.fetchPositionEvents(lastMapId);
	}

	updateState(stateChange) {
		this.setState(stateChange)
	}

	render() {
		return (
			<div>
				<ToastContainer autoClose={5000} hideProgressBar={true} transition={Slide}/>
				<div id="site-wrapper" className="flex-between">
					<SourceSelect
						sourcePlayers={this.state.sourcePlayers}
						sourcePlayerKillEventCount={this.state.sourcePlayerKillEventCount}
						sourcePlayerPositionEventCount={this.state.sourcePlayerPositionEventCount}
						realms={this.state.realms}
						selectedRealm={this.state.selectedRealm}
						updateState={this.updateState.bind(this)}
						killsVisible={this.state.killsVisible}
						positionsVisible={this.state.positionsVisible}
						selectedSourcePlayerId={this.state.selectedSourcePlayerId}
					/>
					<div>
						<h2>KillTographer</h2>
						<MapView
							mapId={this.state.mapId}
							loadMap={this.loadMap.bind(this)}
							undoMapLoad={this.undoMapLoad.bind(this)}
							killEvents={this.state.killEvents}
							positionEvents={this.state.positionEvents}
							killsVisible={this.state.killsVisible}
							positionsVisible={this.state.positionsVisible}
						/>
					</div>
					<KillFeed killEvents={this.state.killEvents}/>
				</div>
			</div>
		)
	}
}
