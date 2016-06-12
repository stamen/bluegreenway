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
							<div className='six columns'>
								<h2 className='title'>{ title }</h2>
								<p>{ message }</p>
								{ zoneAndProjectDataLoaded ? <a className='button' href='#'>Return to Projects</a> : '' }
							</div>
						</div>
					</div>
				</div>
			);
		}

		// TODO: image doesn't exist in the zone data...where can we get it from?
		let { name, description, image } = zone.properties;

		return (
			<div className='grid-container'>
				<div className='accordian-wrapper row'>
					<div className='title-container'>
						<div className='six columns'>
							<h2 className='title'>{ name }</h2>
							<p>{ (description || 'Zone placeholder description text') + (image ? '' : ' (and placeholder image at right)') }</p>
							<a className='button' href='#'>View on Map</a>
						</div>
						<div
							className='six columns'
							style={ {
								backgroundImage:`url('${ image || 'img/zone-placeholder.jpg' }')`
							} }
						/>
					</div>
					<div className='projects-list'>
						<h4 className='section-title'>Projects</h4>
						{ this.renderProjectItems(storeState.projects.data.items, zone) }
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

	renderProjectItems (projects, zone) {
		projects = this.props.actions.utils.getProjectsInZone(projects, zone);

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