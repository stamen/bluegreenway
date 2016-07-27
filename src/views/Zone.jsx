import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';
import moment from 'moment';
import { get } from 'lodash';

import ProjectItem from '../components/ProjectItem';
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
							<div className='eight columns zone-header'>
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
			alt = '',
			zoneProject = storeState.projects.data.items.find(p => p.name === zone.properties.name),
			mapUrl = 'projects/map';	// TODO: pass this in instead of hardcoding

		// Use zone metadata from CMS instead if we have it
		if (zoneProject) {
			name = zoneProject.name;
			image = zoneProject.images.src;
			alt =  zoneProject.images.alt;

			let temp = document.createElement('div');
			temp.innerHTML = zoneProject.description;
			description = temp.textContent || temp.innerText || '';
		} else {
			image = 'img/' + image;
		}

		return (
			<div className='grid-container'>
				<div className='accordian-wrapper row'>
					<div className='title-container'>
						<div className='zone-header'>
							<h2 className='title'>{ name }</h2>
							<p>{ (description || 'Zone placeholder description text') + (image ? '' : ' (and placeholder image at right)') }</p>
							{/* <Link className='button' onClick={ () => this.onZoneMapLinkClicked(zone) } to={ mapUrl }>View on Map</Link> */}
						</div>
						<div className='item-img'>
							<img src={ `${ image || 'img/zone-placeholder.jpg' }` } alt={ alt }/>
						</div>
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

		// filter down to only the projects in this zone
		projects = this.props.actions.utils.getProjectsInZone(projects, zone)

		// filter down to only projects of the requested category (isOpenSpace)
		.filter(project => {
			let locationCategory = locationCategories.find(category => category.id === project.locationCategory);
			return (locationCategory && locationCategory.openSpace === isOpenSpace);
		})

		// remove the project that matches the current zone
		.filter(project => this.props.store.getState().zoneConfigs.every(zone => zone.bgwZoneId !== project.name));

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