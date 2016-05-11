import * as React from 'react';
import moment from 'moment';

import DateRange from '../components/DateRange';
import MapLayersPicker from '../components/MapLayersPicker';
import MapOverlay from '../components/MapOverlay';
import PageHeader from '../components/PageHeader';
import StoryFilters from '../components/StoryFilters';
import { getCategoryOptions } from '../models/stories';

export default class Stories extends React.Component {

	constructor (props) {
		super(props);

		this.onStateChange = this.onStateChange.bind(this);
		this.unsubscribeStateChange = props.store.subscribe(this.onStateChange);
	}

	onStateChange () {
		let storeState = this.props.store.getState();
		this.setState(storeState);
	}

	componentWillUpdate(nextProps, nextState) {
		var urlMode = nextProps.params.mode;
		var appMode = nextProps.store.getState().mode;
		if (urlMode !== appMode) {
			this.updateModeUrl(appMode);
		}

		if (nextState.stories.data.items.length !== this.state.stories.data.items.length) {
			this.updateFilterOptions(nextState.stories);
		}
	}

	updateModeUrl (mode) {
		this.props.history.push(`/stories/${mode}`);
	}

	componentWillMount () {
		var urlMode = this.props.params.mode;
		if (urlMode) {
			this.props.actions.modeChanged(urlMode);
		}
		this.onStateChange();

		// Fetch data if we need to
		if (!this.props.store.getState().stories.data.items.length) {
			this.props.actions.fetchStoriesData();
		}
		if (this.props.store.getState().stories.selectedStory) {
			this.props.actions.updateSelectedStory(null);
		}
	}

	componentDidMount () {
		//
	}

	componentWillUnmount () {
		this.unsubscribeStateChange();
	}

	componentDidUpdate () {
		//
	}

	updateFilterOptions (stories) {
		this.props.actions.storyCategoryChange(getCategoryOptions(stories));
	}

	viewStory (title, id) {
		title = title.replace(/ /g, '-');
		const mode = this.state.mode;
		const path = `/stories/${mode}/${title}?id=${id}`;
		this.props.actions.updateSelectedStory({ title, id });
		this.props.history.push(path);
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
				{ this.state.mode === 'page' ? this.renderPageView() : this.renderMapView() }
			</div>
		);

	}

	renderPageView () {
		return (
			<div className="grid-container">
				<PageHeader />
				{ this.state.stories.data.error ?
					<div className="stories-data-load-error">We're having a hard time loading data. Please try again.</div> :
					null }
				{ this.renderRows(this.state.stories.data.items) }
			</div>
		);
	}

	renderRows (stories) {
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
					<div className='three columns' style={{ background: 'white' }}>
						<DateRange
							minDate={moment('1/1/2016', 'M/D/YYYY')}
							maxDate={moment()}
							initialStartDate={this.state.stories.startDate}
							initialEndDate={this.state.stories.endDate}
							onRangeChange={(range) => this.handleRangeChange(range)} />
					</div>
					<div className='three columns filter-cell' style={{ background: 'white' }}>
						<div className="filter-header">Filter Stories</div>
						<StoryFilters
							categoryOptions={this.state.stories.categoryOptions} />
					</div>
					{ firstStory ? this.renderStory(firstStory, 0) : null }
				</div>
				{ storyCells }
			</div>
		);
	}

	renderStory (story, index) {
		const { id, title, images, category, body } = story;
		return (
			<div
				className='story-cell six columns'
				key={id}
				style={{ backgroundImage: `url(${images[0].src})` }}
				onClick={(() => this.viewStory(title, id))}
			>
				<div className="story-category">{ category }</div>
				<div className="story-text">
					<div className="story-title">{ title.replace(/_/g, ' ') }</div>
					<div className="story-body" dangerouslySetInnerHTML={{ __html: body}}></div>
				</div>
			</div>
		);
	}

	renderMapView () {
		return (
			<div className="stories-map-overlay two columns">
				<MapOverlay collapsible={true}>
					<MapLayersPicker
						layers={this.state.mapLayersPicker.layers}
						onLayerChange={this.props.actions.mapLayersPickerLayerChange}
						transportation={this.state.mapLayersPicker.transportation}
						onTransportationChange={this.props.actions.mapLayersPickerTransportationChange}
						/>
				</MapOverlay>
				<MapOverlay collapsible={true}>
					<DateRange
						minDate={moment('1/1/2016', 'M/D/YYYY')}
						maxDate={moment()}
						initialStartDate={this.state.stories.startDate}
						initialEndDate={this.state.stories.endDate}
						onRangeChange={(range) => this.handleRangeChange(range)} />
				</MapOverlay>
			</div>
		);
	}

}
