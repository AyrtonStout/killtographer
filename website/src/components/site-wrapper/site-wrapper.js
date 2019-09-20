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
			selectedSourcePlayer: null,
			sourcePlayers: [],
			sourcePlayerEventCount: {},
			previousMapIds: [],
			killEvents: [],
			realms: [],
			selectedRealm: {}
		}
	}

	componentDidMount() {
		this.fetchKillEvents(this.state.mapId);
		this.fetchSourcePlayers();
		this.fetchRealms();
	}

	fetchSourcePlayers() {
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
		};

		if (this.state.sourcePlayerId != null) {
			params.sourcePlayerId = this.state.selectedSourcePlayer.id
		}

		Api.get('kill-events', params).then(res => this.setState({ killEvents: res }) );
	}

	loadMap(mapId) {
		const previousMapIds = this.state.previousMapIds.slice(0);
		previousMapIds.push(this.state.mapId);

		this.setState({ mapId, previousMapIds, killEvents: [] });

		this.fetchKillEvents(mapId);
	}

	undoMapLoad() {
		if (this.state.previousMapIds.length === 0) {
			return;
		}

		const previousMapIds = this.state.previousMapIds.slice(0);
    const lastMapId = previousMapIds.pop();

    this.setState({ mapId: lastMapId, previousMapIds, killEvents: [] });
		this.fetchKillEvents(lastMapId);
	}

	render() {
		return (
			<div id="site-wrapper">
				<ToastContainer autoClose={5000} hideProgressBar={true} transition={Slide}/>
				<SourceSelect
					sourcePlayers={this.state.sourcePlayers}
					sourcePlayerEventCount={this.state.sourcePlayerEventCount}
					realms={this.state.realms}
					selectedRealm={this.state.selectedRealm}
				/>
				<MapView
					mapId={this.state.mapId}
					loadMap={this.loadMap.bind(this)}
					undoMapLoad={this.undoMapLoad.bind(this)}
					killEvents={this.state.killEvents}
				/>
				<KillFeed killEvents={this.state.killEvents}/>
			</div>
		)
	}
}
