import React, { PropTypes } from 'react';
import Dropdown from 'react-dropdown';

export default class EventFilters extends React.Component {
	static propTypes = {
		locationOptions: PropTypes.array,
		eventTypeOptions: PropTypes.array,
		ageRangeOptions: PropTypes.array,
		costOptions: PropTypes.array,
		onFilterChange: PropTypes.func
	};

	constructor (props) {
		super(props);
		this.applyFilters = this.applyFilters.bind(this);
	}

	componentWillMount () {
		this.setState({
			ageRange: '',
			filterAgeRange: '',
			filterEventType: '',
			filterLocation: ''
		});
	}

	applyFilters () {
		if (this.props.onFilterChange) {
			this.props.onFilterChange(this.state);
		}
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
			<div className="filter-container">
				<Dropdown
					placeholder={ this.state.filterLocation ? this.state.filterLocation.label : 'Location' }
					onChange={ location => this.handleLocationChange(location) }
					options={ this.props.locationOptions }
					value={ this.state.filterLocation }
				/>
				<Dropdown
					placeholder={ this.state.filterEventType ? this.state.filterEventType.label : 'Event Type' }
					onChange={ eventType => this.handleEventTypeChange(eventType) }
					options={ this.props.eventTypeOptions }
					value={ this.state.filterEventType }
				/>
				<Dropdown
					placeholder={ this.state.filterAgeRange ? this.state.filterAgeRange.label : 'Age Range' }
					onChange={ ageRange => this.handleAgeRangeChange(ageRange) }
					options={ this.props.ageRangeOptions }
					value={ this.state.filterAgeRange }
				/>
				<Dropdown
					placeholder={ this.state.filterCost ? this.state.filterCost.label : 'Cost' }
					onChange={ cost => this.handleCostChange(cost) }
					options={ this.props.costOptions }
					value={ this.state.filterCost }
				/>
				<button className="filter-button" onClick={ this.applyFilters }>
					search
				</button>
			</div>
		);
	}

}
