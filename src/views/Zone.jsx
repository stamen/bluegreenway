import React, { Component } from 'react';
import { withRouter } from 'react-router';
import moment from 'moment';
import { get } from 'lodash';

import { zoneConfigs } from './Projects.jsx';
import ProjectItem from '../components/ProjectItem';
import DateRange from '../components/DateRange';
import MapLayersPicker from '../components/MapLayersPicker';
import MapOverlay from '../components/MapOverlay';
import PageHeader from '../components/PageHeader';

/**
 * This component draws the page displayed when a zone is clicked from /projects.
 * This page lists individual projects within the selected Zone,
 * while the Projects component shows the Blue Greenway zones.
 * Confusing, right? Sorry...
 */
class Zone extends Component {
	constructor(props) {
		super(props);
		this.onStateChange = this.onStateChange.bind(this);
		this.unsubscribeStateChange = props.store.subscribe(this.onStateChange);
	}

	componentWillMount () {
		if (!this.props.store.getState().projects.data.items.length) {
			this.props.actions.fetchProjectsData();
		}
		this.onStateChange();
	}

	componentDidMount () {
		//
	}

	componentWillUpdate(nextProps, nextState) {
		const zoneTitle = this.props.params.zone;
		if (nextState.projects !== this.state.projects) {
			console.log('we got projects now');
		}
	}

	componentDidUpdate () {
		//
	}

	componentWillUnmount () {
		this.unsubscribeStateChange();
	}

	onStateChange () {
		let storeState = this.props.store.getState();
		this.setState(storeState);
	}

	mapProjectZone(BGWZone) {
		if (BGWZone === 'Hunters Point Naval Shipyard/Candlestick') {
			return 'shipyard_candlestick';
		} else if (BGWZone === "India Basin") {
			return 'india_basin';
		} else if (BGWZone === "Pier 70/Central Waterfront") {
			return 'pier_70';
		} else if (BGWZone === "Mission Bay/Mission Rock") {
			return 'mission_bay_mission_rock';
		} else {
			return null;
		}
	}

	render() {
		// map view is always handled by Projects.jsx, not Zone.jsx,
		// so there is only renderPageView().
		return (
			<div id='zone'>
				{ this.renderPageView() }
			</div>
		);
	}

	renderPageView () {
		// TODO: this should come from store.geodata.zones (see TODO in Projects.jsx)
		let zoneConfig = zoneConfigs.find(z => z.slug === this.props.params.zone);

		if (!zoneConfig) {
			return (
				<div className='grid-container'>
					<div className='accordian-wrapper row'>
						<div className='title-container'>
							<div className='six columns'>
								<h2 className='title'>Oops...</h2>
								<p>There is no Blue Greenway zone at this URL. Click the button below to return to the projects page.</p>
								<a className='button' href='#'>Return to Projects</a>
							</div>
						</div>
					</div>
				</div>
			);
		}

		console.log(">>>>> TODO: make sure this path works on a hard refresh and when navigated to at runtime. Need to have zones data loaded before rendering. Also, refactor out the store listener and setState() calls.");

		let zoneData = get(this.props.store.getState().geodata, 'zones.geojson.features');
		zoneData = zoneData ? zoneData.find(z => z.properties.map_id === zoneConfig.id) : null;

		// if the URL specifies a valid zone, but we haven't yet loaded the data for it,
		// don't render anything yet.
		if (!zoneData) return null;

		// TODO: image doesn't exist in the zone data...where can we get it from?
		let { name, description, image } = zoneData.properties;

		return (
			<div className='grid-container'>
				<div className='accordian-wrapper row'>
					<div className='title-container'>
						<div className='six columns'>
							<h2 className='title'>{ name }</h2>
							<p>{ description }</p>
							<a className='button' href='#'>View on Map</a>
						</div>
						<div
							className='six columns'
							style={ {
								backgroundImage:'url("img/zone-placeholder.jpg")'
								// backgroundImage:`url('${ image }')`
							} }
						/>
					</div>
					<div className='projects-list'>
						<h4 className='section-title'>Projects</h4>
						{ this.state.projects.data.items.length?
							this.renderProjectItems(this.state.projects.data.items, name) :
							<div className='loading'><p>loading projects...</p></div> }
					</div>
					<div className='open-spaces-list'>
						<h4 className='section-title'>Open Spaces</h4>
						{ /* this.renderOpenSpacesItems() */ }
						<div className='loading'><p>open spaces info coming soon!</p></div>
					</div>
				</div>
			</div>
		);
	}

	renderProjectItems (projects, zoneName) {
		projects = projects.filter(project => {
			return this.mapProjectZone(project.BGWZone) === zoneName;
		});
		console.log(">>>>> filtered projects on zonename:", zoneName, "; filtered projects:", projects);

		let projectListItems = [];

		if (projects.length) {
			projectListItems = projects.map(project => {
				return (
					<ProjectItem
						key={ project.id }
						id={ project.id }
						name={ project.name }
						description={ project.description }
						isOpened={ false }
					/>
				);
			});
		}

		return (
			<div className='project-list-items'>
				{ projectListItems }
			</div>
		);
	}

	renderOpenSpacesItems () {
		// renders the list of open spaces for the given zone from???
		// potentially can also use the same logic from renderProjectItems &
		// the <ProjectItem> component, so this method may not be necessary...
	}

}

export default withRouter(Zone);