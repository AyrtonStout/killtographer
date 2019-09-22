import React from 'react';
import {Slide, ToastContainer} from "react-toastify";
import {Api} from "../../services/api";
import {MapView} from "../map-view/map-view";
import {KillFeed} from "../kill-feed/kill-feed";
import {QuerySelect} from "../source-select/query-select";

export class SiteWrapper extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mapId: 947,
			selectedSourcePlayer: null,
			sourcePlayers: [],
			sourcePlayerEventCount: {},
			previousMapIds: [],
			killEvents: [],
			realms: [],
			selectedRealm: {},
			positionEvents: [],
			killEventLimit: 200,
			positionEventLimit: 500,
		}
	}

	componentDidMount() {
		this.fetchKillEvents(this.state.mapId);
		this.fetchPositionEvents(this.state.mapId);
		this.fetchSourcePlayers();
		this.fetchRealms();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
			if (this.state.killEventLimit !== prevState.killEventLimit) {
				this.fetchKillEvents(this.state.mapId);
			} else if (this.state.positionEventLimit !== prevState.positionEventLimit) {
				this.fetchPositionEvents(this.state.mapId);
			} else if (this.state.selectedRealm.id !== prevState.selectedRealm.id) {
				this.fetchSourcePlayers(this.state.selectedRealm);
			}
	}

	fetchSourcePlayers(selectedRealm) {
		Api.get('sources').then(res => this.setState({ sourcePlayers: res }) );
		Api.get('sources/event-count').then(res => {
			const playerIdToEventCount = {};

			res.forEach(entry => {
				playerIdToEventCount[entry.source_player_id] = entry.count;
			});

			this.setState({ sourcePlayerEventCount: playerIdToEventCount })
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

		if (this.state.sourcePlayerId != null) {
			params.sourcePlayerId = this.state.selectedSourcePlayer.id
		}

		this.setState({ killEvents: [] });

		Api.get('kill-events', params).then(res => this.setState({ killEvents: res }) );
	}

	fetchPositionEvents(mapId) {
		const params = {
			mapId: mapId,
			eventLimit: this.state.positionEventLimit
		};

		if (this.state.sourcePlayerId != null) {
			params.sourcePlayerId = this.state.selectedSourcePlayer.id
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
		console.log(stateChange);

		this.setState(stateChange)

	}

	render() {
		return (
			<div id="site-wrapper">
				<ToastContainer autoClose={5000} hideProgressBar={true} transition={Slide}/>
				<QuerySelect
					sourcePlayers={this.state.sourcePlayers}
					sourcePlayerEventCount={this.state.sourcePlayerEventCount}
					realms={this.state.realms}
					selectedRealm={this.state.selectedRealm}
					updateState={this.updateState.bind(this)}
				/>
				<MapView
					mapId={this.state.mapId}
					loadMap={this.loadMap.bind(this)}
					undoMapLoad={this.undoMapLoad.bind(this)}
					killEvents={this.state.killEvents}
					positionEvents={this.state.positionEvents}
				/>
				<KillFeed killEvents={this.state.killEvents}/>
			</div>
		)
	}
}
