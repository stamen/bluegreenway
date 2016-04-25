import * as React from 'react';

import Dropdown from '../components/Dropdown';

export default class EventFilters extends React.Component {

	constructor (props) {
		super(props);
	}

	componentWillMount () {
		this.setState({
			ageRange: '',
			filterAgeRange: '',
			filterEventType: '',
			filterLocation: ''
		});
	}

	componentDidMount () {
	}

	componentWillUnmount () {
	}

	componentDidUpdate () {
	}

	filterEvents () {
		// TODO Actually filter the events based on the filters in our state.
		// Do this by updating redux store.
	}

	handleAgeRangeChange (ageRange) {
		this.setState({ filterAgeRange: ageRange });
	}

	handleCostChange (cost) {
		this.setState({ filterCost: cost });
	}

	handleEventTypeChange (eventType) {
		this.setState({ filterEventType: eventType });
	}

	handleLocationChange (location) {
		this.setState({ filterLocation: location });
	}

	render () {
		return (
			<div>
				<Dropdown
					placeholder="Location"
					onChange={location => this.handleLocationChange(location)}
					options={this.props.locationOptions} />
				<Dropdown
					placeholder="Event Type"
					onChange={eventType => this.handleEventTypeChange(eventType)}
					options={this.props.eventTypeOptions} />
				<Dropdown
					placeholder="Age Range"
					onChange={ageRange => this.handleAgeRangeChange(ageRange)}
					options={this.props.ageRangeOptions} />
				<Dropdown
					placeholder="Cost"
					onChange={cost => this.handleCostChange(cost)}
					options={this.props.costOptions} />
				<button className="filter-button" onClick={this.filterEvents.bind(this)}>
					search
				</button>
			</div>
		);
	}

}
