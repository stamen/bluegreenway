import * as React from 'react';
import moment from 'moment';

import DateRange from '../components/DateRange';
import EventFilters from '../components/EventFilters';
import MapOverlay from '../components/MapOverlay';
import PageHeader from '../components/PageHeader';

export default class Events extends React.Component {

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
	}

	updateModeUrl (mode) {
		this.props.history.push(`/events/${mode}`);
	}

	componentWillMount () {
		var urlMode = this.props.params.mode;
		if (urlMode) {
			this.props.actions.modeChanged(urlMode);
		}
		this.onStateChange();
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

	handleRangeChange (range) {
		if (range[0]) {
			this.props.actions.eventsMinDateChanged(range[0]);
		}
		if (range[1]) {
			this.props.actions.eventsMaxDateChanged(range[1]);
		}
	}

	render () {
		return (
			<div id="events">
				{ this.state.mode === 'page' ?  this.renderPageView() : this.renderMapView() }
			</div>
		);
	}

	renderPageView () {
		return (
			<div className="grid-container">
				<PageHeader />
				{ this.renderRows(this.props.events) }
			</div>
		);
	}

	renderMapView () {
		return (
			<div className="events-map-overlay two columns">
				<MapOverlay>
					map layers
				</MapOverlay>
				<MapOverlay>
					<DateRange 
						minDate={moment('1/1/2016', 'M/D/YYYY')} 
						maxDate={moment()}
						initialStartDate={this.state.events.startDate} 
						initialEndDate={this.state.events.endDate}
						onRangeChange={(range) => this.handleRangeChange(range)} />
				</MapOverlay>
			</div>
		);
	}

	renderRows (events) {

		events = [
			{ date: moment('3/16/2016', 'M/D/YYYY'), shortMonth: 'mar', day: 16, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-16' },
			{ date: moment('3/17/2016', 'M/D/YYYY'), shortMonth: 'mar', day: 17, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-17' },
			{ date: moment('3/18/2016', 'M/D/YYYY'), shortMonth: 'mar', day: 18, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-18' },
			{ date: moment('3/19/2016', 'M/D/YYYY'), shortMonth: 'mar', day: 19, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-19' },
			{ date: moment('3/20/2016', 'M/D/YYYY'), shortMonth: 'mar', day: 20, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-20' },
			{ date: moment('3/21/2016', 'M/D/YYYY'), shortMonth: 'mar', day: 21, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-21' },
			{ date: moment('3/22/2016', 'M/D/YYYY'), shortMonth: 'mar', day: 22, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-22' },
			{ date: moment('3/23/2016', 'M/D/YYYY'), shortMonth: 'mar', day: 23, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-23' },
			{ date: moment('3/24/2016', 'M/D/YYYY'), shortMonth: 'mar', day: 24, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-24' },
			{ date: moment('3/25/2016', 'M/D/YYYY'), shortMonth: 'mar', day: 25, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-25' },
			{ date: moment('3/26/2016', 'M/D/YYYY'), shortMonth: 'mar', day: 26, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-26' },
			{ date: moment('3/27/2016', 'M/D/YYYY'), shortMonth: 'mar', day: 27, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-27' },
			{ date: moment('3/28/2016', 'M/D/YYYY'), shortMonth: 'mar', day: 28, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-28' },
			{ date: moment('3/29/2016', 'M/D/YYYY'), shortMonth: 'mar', day: 29, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-29' },
			{ date: moment('3/30/2016', 'M/D/YYYY'), shortMonth: 'mar', day: 30, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-30' },
			{ date: moment('3/31/2016', 'M/D/YYYY'), shortMonth: 'mar', day: 31, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-31' },
			{ date: moment('4/1/2016', 'M/D/YYYY'), shortMonth: 'apr', day: 1, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-apr-01' },
			{ date: moment('4/2/2016', 'M/D/YYYY'), shortMonth: 'apr', day: 2, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-apr-02' },
			{ date: moment('4/3/2016', 'M/D/YYYY'), shortMonth: 'apr', day: 3, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-apr-03' },
			{ date: moment('4/4/2016', 'M/D/YYYY'), shortMonth: 'apr', day: 4, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-apr-04' }
		];

		events = events.filter((event) => event.date >= this.state.events.startDate && event.date <= this.state.events.endDate);

		let firstEvent = events[0],
			secondEvent = events[1],
			remainingEventRows;

		// pack events into rows of four
		if (events.length > 2) {
			remainingEventRows = events.slice(2).reduce((out, event, i) => {
				if (i % 4 === 0) {
					out.push([]);
				}
				out[Math.floor(i / 4)].push(event);
				return out;
			}, []);
		}

		let eventCells = [];
		if (remainingEventRows) {
			eventCells = remainingEventRows.map((eventRow, i) => {
				return (
					<div className='row' key={ 'row=' + i }>
						{ eventRow.map(event => this.renderEvent(event)) }
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
							initialStartDate={this.state.events.startDate} 
							initialEndDate={this.state.events.endDate}
							onRangeChange={(range) => this.handleRangeChange(range)} />
					</div>
					<div className='three columns filter-cell' style={{ background: 'white' }}>
						<div className="filter-header">Filter Events</div>
						<EventFilters 
							locationOptions={this.state.events.locationOptions}
							eventTypeOptions={this.state.events.eventTypeOptions}
							ageRangeOptions={this.state.events.ageRangeOptions}
							costOptions={this.state.events.costOptions} />
					</div>
					{ firstEvent ? this.renderEvent(firstEvent) : null }
					{ secondEvent ? this.renderEvent(secondEvent) : null }
				</div>
				{ eventCells }
			</div>
		);

	}

	renderEvent (event) {

		return (
			<div className='event-cell three columns' key={ event.id }>
				<div className='event-date'>
					<span>{ event.shortMonth }</span>
					<span>{ event.day }</span>
				</div>
				<div className='event-details'>
					<p className='event-title'>{ event.title }</p>
					<p>Time: <span>{ event.time }</span></p>
					<p>Cost: <span>{ event.cost }</span></p>
				</div>
			</div>
		);

	}

}
