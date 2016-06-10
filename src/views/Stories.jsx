import * as React from 'react';
import { withRouter } from 'react-router';
import moment from 'moment';

import DateRange from '../components/DateRange';
import MapLayersPicker from '../components/MapLayersPicker';
import MapOverlay from '../components/MapOverlay';
import PageHeader from '../components/PageHeader';
import StoryFilters from '../components/StoryFilters';
import { getCategoryOptions } from '../models/stories';

class Stories extends React.Component {

	constructor (props) {
		super(props);
		this.state = {};
		this.onStateChange = this.onStateChange.bind(this);
		this.unsubscribeStateChange = props.store.subscribe(this.onStateChange);
	}

	componentWillMount () {
		this.setState({ stories: {
			categoryOptions: []
		}});

		var urlMode = this.props.params.mode;
		var appMode = this.props.store.getState().mode;

		if (urlMode) {
			this.props.actions.modeChanged(urlMode);
		} else {
			this.updateModeUrl(appMode);
		}

		this.props.actions.mapLayersPickerProjectsChange(false);

		this.onStateChange();

		// Fetch data if we need to
		if (!this.props.store.getState().stories.data.items.length) {
			this.props.actions.fetchStoriesData();
		}
		if (this.props.store.getState().stories.selectedStory) {
			this.props.actions.updateSelectedStory(null);
		}
		if (this.props.store.getState().stories.data.items.length &&
			!this.props.store.getState().stories.categoryOptions.length) {
			this.updateFilterOptions(this.props.store.getState().stories);
		}
	}

	componentDidMount () {
		//
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

	componentDidUpdate () {
		//
	}

	componentWillUnmount () {
		this.unsubscribeStateChange();
	}

	updateModeUrl (mode) {
		this.props.router.push(`/stories/${mode}`);
	}

	onStateChange () {
		let storeState = this.props.store.getState();
		this.setState(storeState);
	}

	updateFilterOptions (stories) {
		this.props.actions.storyCategoryChange(getCategoryOptions(stories));
		this.setState({

		});
	}

	viewStory (title, id) {
		const mode = this.state.mode;
		const path = `/stories/${mode}/${title}?id=${id}`;
		this.props.actions.updateSelectedStory({ title, id });
		this.props.router.push(path);
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
				onClick={(() => this.viewStory(title, id))}
				style={{ backgroundImage: `url(${images[0].src})` }}
				>
				<div className='story-shade'>
					<div className="story-category">{ category }</div>
					<div className="story-text">
						<div className="story-title">{ title.replace(/_/g, ' ') }</div>
						<div className="story-body" dangerouslySetInnerHTML={{ __html: body}}></div>
					</div>
				</div>
			</div>
		);
	}

	renderMapView () {
		return (
			<div className="stories-map-overlay">
				<MapOverlay collapsible={true}>
					<MapLayersPicker
						layers={this.state.mapLayersPicker.layers}
						onLayerChange={this.props.actions.mapLayersPickerLayerChange}
						transportation={this.state.mapLayersPicker.transportation}
						onTransportationChange={this.props.actions.mapLayersPickerTransportationChange}
						/>
				</MapOverlay>
			</div>
		);
	}

}

export default withRouter(Stories);