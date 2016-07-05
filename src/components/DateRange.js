import React, { PropTypes } from 'react';
import DatePicker from 'react-date-picker';
import moment from 'moment';

export default class DateRange extends React.Component {
	static propTypes = {
		minDate: PropTypes.object,
		maxDate: PropTypes.object,
		initialStartDate: PropTypes.object,
		initialEndDate: PropTypes.object,
		onRangeChange: PropTypes.func
	};

	constructor (props) {
		super(props);
	}

	componentWillMount () {
		this.setState({
			startDateText: this.props.initialStartDate.format('M/D/YYYY'),
			startDate: this.props.initialStartDate,
			endDateText: this.props.initialEndDate.format('M/D/YYYY'),
			endDate: this.props.initialEndDate
		});
	}

	getRange () {
		let range = [];
		if (this.state.startDate) {
			range.push(this.state.startDate);
		}
		if (this.state.endDate) {
			range.push(this.state.endDate);
		}
		return range;
	}

	dateStartChange (e) {
		let state = { startDateText: e.target.value };
		// If moment returns a value in our allowed range, set startDate
		let start = moment(e.target.value, 'M/D/YYYY');
		if (start && start > this.props.minDate && start < this.props.maxDate) {
			state.startDate = start;
		}
		this.setState(state);
	}

	dateEndChange (e) {
		let state = { endDateText: e.target.value };
		// If moment returns a value in our allowed range, set endDate
		let end = moment(e.target.value, 'M/D/YYYY');
		if (end && end > this.props.minDate && end < this.props.maxDate) {
			state.endDate = end;
		}
		this.setState(state);
	}

	dateRangeChange (text, moments) {
		let rangeState = {
			startDate: moments[0],
			startDateText: text[0],
			endDate: null,
			endDateText: ''
		};
		if (moments.length > 1) {
			rangeState.endDate = moments[1];
			rangeState.endDateText = text[1];
		}
		this.setState(rangeState);
		if (this.props.onRangeChange) {
			this.props.onRangeChange([rangeState.startDate, rangeState.endDate]);
		}
	}

	render () {
		return (
			<div>
				<div>
					<input 
						className="date-range-input" 
						type="text" 
						value={this.state.startDateText}
						onChange={((e) => this.dateStartChange(e))}
						placeholder="Date From" />
					<input
						className="date-range-input"
						type="text"
						value={this.state.endDateText}
						onChange={((e) => this.dateEndChange(e))}
						placeholder="Date To" />
				</div>
				<DatePicker
					dateFormat='M/D/YYYY'
					minDate={this.props.minDate}
					maxDate={this.props.maxDate} 
					highlightRangeOnMouseMove={true} 
					range={this.getRange()} 
					hideFooter={true}
					onRangeChange={((text, moments) => this.dateRangeChange(text, moments))} />
			</div>
		);
	}
}
