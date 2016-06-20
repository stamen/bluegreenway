import * as React from 'react';
import { withRouter } from 'react-router';
import moment from 'moment';

import Story from '../components/Story';
import DateRange from '../components/DateRange';
import MapLayersPicker from '../components/MapLayersPicker';
import MapOverlay from '../components/MapOverlay';
import PageHeader from '../components/PageHeader';
import StoryFilters from '../components/StoryFilters';
import { getCategoryOptions } from '../models/stories';

class Stories extends React.Component {

	constructor (props) {
		super(props);
	}

	componentWillMount () {
		const storeState = this.props.store.getState();
		this.props.actions.mapLayersPickerProjectsChange(false);

		// Fetch data if we need to
		if (!storeState.stories.data.items.length) {
			this.props.actions.fetchStoriesData();
		}
		if (storeState.stories.selectedStory) {
			this.props.actions.updateSelectedStory(null);
		}
		if (storeState.stories.data.items.length &&
			!storeState.stories.categoryOptions.length) {
			this.updateFilterOptions(storeState.stories);
		}
	}

	componentWillUpdate (nextProps, nextState) {
		const storeState = this.props.store.getState();
		if (storeState.stories.data.items.length &&
			!storeState.stories.categoryOptions.length) {
			this.updateFilterOptions(storeState.stories);
		}
	}

	updateFilterOptions (stories) {
		console.log(">>>>> updateFilterOptions");
		this.props.actions.storyCategoryChange(getCategoryOptions(stories));
	}

	handleRangeChange (range) {
		if (range[0]) {
			this.props.actions.storiesMinDateChanged(range[0]);
		}
		if (range[1]) {
			this.props.actions.storiesMaxDateChanged(range[1]);
		}
	}

	render () {
		return (
			<div id="stories">
				{ this.props.params.mode === 'page' ? this.renderPageView() : this.renderMapView() }
			</div>
		);
	}

	renderPageView () {
		const storeState = this.props.store.getState();
		return (
			<div className="grid-container">
				<PageHeader />
				{ storeState.stories.data.error ?
					<div className="stories-data-load-error">"We're having a hard time loading data. Please try again."</div> :
					null }
				{ this.renderRows(storeState.stories.data.items) }
			</div>
		);
	}

	renderRows (stories) {
		const storeState = this.props.store.getState();
		let firstStory = stories[0],
			remainingStoryRows;

		// Pack stories into rows of 2
		if (stories.length > 1) {
			remainingStoryRows = stories.slice(1).reduce((out, story, i) => {
				if (i % 2 === 0) {
					out.push([]);
				}
				out[Math.floor(i / 2)].push(story);
				return out;
			}, []);
		}

		let storyCells = [];
		if (remainingStoryRows) {
			storyCells = remainingStoryRows.map((storyRow, i) => {
				return (
					<div className='row' key={ 'row=' + i }>
						{ storyRow.map((story, i) => this.renderStory(story, i)) }
					</div>
				);
			});
		}

		return (
			<div>
				<div className='row'>
					<div className='three columns' style={ { background: 'white' } }>
						<DateRange
							minDate={ moment('1/1/2016', 'M/D/YYYY') }
							maxDate={ moment() }
							initialStartDate={ storeState.stories.startDate }
							initialEndDate={ storeState.stories.endDate }
							onRangeChange={ (range) => this.handleRangeChange(range) } />
					</div>
					<div className='three columns filter-cell' style={ { background: 'white' } }>
						<div className="filter-header">Filter Stories</div>
						<StoryFilters
							categoryOptions={ storeState.stories.categoryOptions } />
					</div>
					{ firstStory ? this.renderStory(firstStory, 0) : null }
				</div>
				{ storyCells }
			</div>
		);
	}

	renderStory(story) {
		return (
			<Story
				{ ...story }
				onClick={ this.props.actions.updateSelectedStory }
				key={ story.id }
				router={ this.props.router }
				mode={ this.props.params.mode }
			/>
		);
	}

	renderMapView () {
		const storeState = this.props.store.getState();
		return (
			<div className="stories-map-overlay">
				<MapOverlay collapsible={ true }>
					<MapLayersPicker
						title='Recreation'
						layers={ storeState.mapLayersPicker.layers }
						onLayerChange={ this.props.actions.mapLayersPickerLayerChange }
					/>
				</MapOverlay>
				<MapOverlay collapsible={ true }>
					<MapLayersPicker
						title='Transportation'
						layers={ storeState.mapLayersPicker.transportation }
						onLayerChange={ this.props.actions.mapLayersPickerTransportationChange }
					/>
				</MapOverlay>
			</div>
		);
	}

}

export default withRouter(Stories);
