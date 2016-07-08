import * as React from 'react';
import { withRouter } from 'react-router';
import moment from 'moment';

import Story from '../components/Story';
import DateRange from '../components/DateRange';
import MapLayersPicker from '../components/MapLayersPicker';
import {MapOverlayContainer, MapOverlay} from '../components/MapOverlay';
import PageHeader from '../components/PageHeader';
import StoryFilters from '../components/StoryFilters';
import { getCategoryOptions, getFilteredStories } from '../models/stories';

class Stories extends React.Component {

	constructor (props) {
		super(props);
		this.updateFilters = this.updateFilters.bind(this);
	}

	componentWillMount () {
		const storeState = this.props.store.getState();
		
		// set map layers
		this.props.actions.mapLayersPickerStoriesChange(true);
		this.props.actions.mapLayersPickerEventsChange(false);
		this.props.actions.mapLayersPickerProjectsChange(true);

		// Fetch data if we need to
		if (!storeState.stories.data.items.length) {
			this.props.actions.fetchStoriesData();
		}

		// Clear any currently selected story
		if (storeState.stories.selectedStory) {
			this.props.actions.updateSelectedStory(null);
		}

		if (storeState.stories.data.items.length &&
			!storeState.stories.categoryOptions.length) {
			// stories have loaded but filter options have not yet been derived
			this.deriveFilterOptions(storeState.stories);
		}
	}

	shouldComponentUpdate () {
		return !this.updatingFilters;
	}

	componentWillUpdate (nextProps, nextState) {
		const storeState = this.props.store.getState();
		if (storeState.stories.data.items.length &&
			!storeState.stories.categoryOptions.length) {
			// stories have loaded but filter options have not yet been derived
			this.deriveFilterOptions(storeState.stories);
		}
	}

	deriveFilterOptions (stories) {
		this.props.actions.storyCategoriesChange(getCategoryOptions(stories));
	}

	updateFilters () {
		this.updatingFilters = true;

		const {
			startDate,
			endDate
		} = this.refs.dateFilter.state;
		const {
			filterCategory,
		} = this.refs.storyFilter.state;

		let filtersToSet = [];
		if (startDate) {
			filtersToSet.push({
				func: this.props.actions.eventsMinDateChanged,
				args: [startDate]
			});
		}
		if (endDate) {
			filtersToSet.push({
				func: this.props.actions.eventsMaxDateChanged,
				args: [endDate]
			});
		}

		// empty values are allowed here (to clear the filter)
		filtersToSet.push({
			func: this.props.actions.storyCategoryChange,
			args: [filterCategory && filterCategory.value !== 'Any' ? filterCategory.value : '']
		});

		if (filtersToSet.length) {
			filtersToSet.forEach((filterObj, i) => {
				if (i === filtersToSet.length - 1) {
					// let the last filter change trigger a render
					this.updatingFilters = false;
				}
				filterObj.func(...filterObj.args);
			});
		} else {
			this.updatingFilters = false;
		}
	}

	render () {
		let storyItems = getFilteredStories(this.props.store.getState().stories);
		return (
			<div id="stories">
				{ this.props.params.mode === 'page' ? this.renderPageView(storyItems) : this.renderMapView(storyItems) }
			</div>
		);
	}

	renderPageView (storyItems) {
		const storeState = this.props.store.getState();
		return (
			<div className="grid-container">
				<PageHeader />
				{ storeState.stories.data.error ?
					<div className="stories-data-load-error">"We're having a hard time loading data. Please try again."</div> :
					null }
				{ this.renderRows(storyItems) }
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
					<div className='three columns date-picker-cell' style={ { background: 'white' } }>
						<DateRange
							ref='dateFilter'
							minDate={ moment('1/1/2015', 'M/D/YYYY') }
							maxDate={ moment().add(1, 'year') }
							initialStartDate={ storeState.stories.startDate }
							initialEndDate={ storeState.stories.endDate }
							onRangeChange={ this.updateFilters }
						/>
					</div>
					<div className='three columns filter-cell' style={ { background: 'white' } }>
						<div className="filter-header">Filter Stories</div>
						<StoryFilters
							ref='storyFilter'
							categoryOptions={ storeState.stories.categoryOptions }
							onFilterChange={ this.updateFilters }
						/>
					</div>
					{ firstStory ? this.renderStory(firstStory, 0) : null }
				</div>
				{ storyCells }
			</div>
		);
	}

	renderStory (story) {
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

	renderMapView (storyItems) {
		const storeState = this.props.store.getState();
		return (
			<MapOverlayContainer>
				<MapOverlay>
					<MapLayersPicker
						title='Stories'
						layers={ storeState.mapLayersPicker.storyCategories }
						onLayerChange={ this.props.actions.mapLayersPickerStoryCategoriesChange }
					/>
				</MapOverlay>
				<MapOverlay>
					<MapLayersPicker
						title='Recreation'
						layers={ storeState.mapLayersPicker.layers }
						onLayerChange={ this.props.actions.mapLayersPickerLayerChange }
					/>
				</MapOverlay>
				<MapOverlay>
					<MapLayersPicker
						title='Transportation'
						layers={ storeState.mapLayersPicker.transportation }
						onLayerChange={ this.props.actions.mapLayersPickerTransportationChange }
					/>
				</MapOverlay>
			</MapOverlayContainer>
		);
	}

}

export default withRouter(Stories);
