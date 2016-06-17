import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';
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
		this.onProjectMapLinkClicked = this.onProjectMapLinkClicked.bind(this);
		this.onZoneMapLinkClicked = this.onZoneMapLinkClicked.bind(this);
	}

	componentWillMount () {
		const storeState = this.props.store.getState();
		if (!get(storeState.projects, 'data.items.length')) {
			this.props.actions.fetchProjectsData();
		}
		if (!get(storeState.geodata, 'zones.geojson.features')) {
			this.props.actions.fetchZoneGeoData();
		}
	}

	render () {
		// map view is always handled by Projects.jsx, not Zone.jsx,
		// so there is only renderPageView().
		return (
			<div id='zone'>
				{ this.renderPageView() }
			</div>
		);
	}

	renderPageView () {
		const storeState = this.props.store.getState();

		let zone = this.props.actions.utils.getZoneBySlug(this.props.params.zone),
			zoneAndProjectDataLoaded = !!get(storeState.projects, 'data.items.length') && !!get(storeState.geodata, 'zones.geojson.features');

		if (!zone) {
			let title,
				message;

			if (!zoneAndProjectDataLoaded) {
				// projects/zones data not yet loaded
				title = '';
				message = 'Loading projects...';
			} else {
				// invalid slug/zone
				title = 'Oops...';
				message = 'There is no Blue Greenway zone at this URL. Click the button below to return to the projects page.';
			}

			return (
				<div className='grid-container'>
					<div className='accordian-wrapper row'>
						<div className='title-container'>
							<div className='six columns zone-header'>
								<h2 className='title'>{ title }</h2>
								<p>{ message }</p>
								{ zoneAndProjectDataLoaded ? <a className='button' href='#'>Return to Projects</a> : '' }
							</div>
						</div>
					</div>
				</div>
			);
		}

		let { name, description, image } = zone.properties,
			mapUrl = 'projects/map';	// TODO: pass this in instead of hardcoding

		return (
			<div className='grid-container'>
				<div className='accordian-wrapper row'>
					<div className='title-container'>
						<div className='six columns zone-header'>
							<h2 className='title'>{ name }</h2>
							<p>{ (description || 'Zone placeholder description text') + (image ? '' : ' (and placeholder image at right)') }</p>
							<Link className='button' onClick={ () => this.onZoneMapLinkClicked(zone) } to={ mapUrl }>View on Map</Link>
						</div>
						<div
							className='six columns zone-img'
							style={ {
								backgroundImage:`url('img/${ image || 'zone-placeholder.jpg' }')`
							} }
						/>
					</div>
					<div className='projects-list'>
						<h4 className='section-title'>Projects</h4>
						{ this.renderProjectItems(storeState.projects.data.items, zone, false) }
					</div>
					<div className='open-spaces-list'>
						<h4 className='section-title'>Open Spaces</h4>
						{ this.renderProjectItems(storeState.projects.data.items, zone, true) }
					</div>
				</div>
			</div>
		);
	}

	renderProjectItems (projects, zone, isOpenSpace) {
		const locationCategories = [
			{
				id: 'Park or Playground',
				openSpace: true
			},
			{
				id: 'Other',
				openSpace: false
			}
		];

		projects = this.props.actions.utils.getProjectsInZone(projects, zone);
		projects = projects.filter(project => {
			let locationCategory = locationCategories.find(category => category.id === project.locationCategory);
			return (locationCategory && locationCategory.openSpace === isOpenSpace);
		});

		let projectListItems = [];

		if (projects.length) {
			projectListItems = projects.map(project => {
				return (
					<ProjectItem
						key={ project.id }
						project={ project }
						viewOnMapCB={ this.onProjectMapLinkClicked }
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

	onZoneMapLinkClicked (zone) {
		// KLUDGE: set zone on map after navigating to map
		setTimeout(() => {
			console.log(">>>>> TODO: view zone on map:", zone);
			// this.props.actions.updateSelectedZone(zone);
		}, 100);
	}

	onProjectMapLinkClicked (project) {
		// KLUDGE: set project on map after navigating to map
		setTimeout(() => {
			this.props.actions.updateSelectedProject(project);
		}, 100);
	}

}

export default withRouter(Zone);