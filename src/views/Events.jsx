import * as React from 'react';

// import components from @stamen/panorama
// import { ItemSelector } from '@stamen/panorama';
// Note: can also just `npm install` individual components, and import like so:
// import ItemSelector from '@stamen/itemselector';

import PageHeader from '../components/PageHeader';

// main app container
export default class Events extends React.Component {

	constructor (props) {

		super(props);

	}

	componentWillMount () {

		//

	}

	componentDidMount () {

		//

	}

	componentWillUnmount () {

		//

	}

	componentDidUpdate () {

		//

	}

	render () {

		return (
			<div id='events' className="grid-container">
				<PageHeader />
				{ this.renderRows(this.props.events) }
			</div>
		);

	}

	renderRows (events) {

		events = [
			{ shortMonth: 'mar', day: 16, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-16' },
			{ shortMonth: 'mar', day: 17, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-17' },
			{ shortMonth: 'mar', day: 18, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-18' },
			{ shortMonth: 'mar', day: 19, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-19' },
			{ shortMonth: 'mar', day: 20, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-20' },
			{ shortMonth: 'mar', day: 21, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-21' },
			{ shortMonth: 'mar', day: 22, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-22' },
			{ shortMonth: 'mar', day: 23, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-23' },
			{ shortMonth: 'mar', day: 24, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-24' },
			{ shortMonth: 'mar', day: 25, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-25' },
			{ shortMonth: 'mar', day: 26, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-26' },
			{ shortMonth: 'mar', day: 27, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-27' },
			{ shortMonth: 'mar', day: 28, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-28' },
			{ shortMonth: 'mar', day: 29, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-29' },
			{ shortMonth: 'mar', day: 30, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-30' },
			{ shortMonth: 'mar', day: 31, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-mar-31' },
			{ shortMonth: 'apr', day: 1, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-apr-01' },
			{ shortMonth: 'apr', day: 2, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-apr-02' },
			{ shortMonth: 'apr', day: 3, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-apr-03' },
			{ shortMonth: 'apr', day: 4, title: 'California Native Plant Society Volunteer Workparty', time: '12:00 am', cost: 'Free', id: 'cali-apr-04' }
		];

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

		let eventCells = remainingEventRows.map((eventRow, i) => {
			return (
				<div className='row' key={ 'row=' + i }>
					{ eventRow.map(event => this.renderEvent(event)) }
				</div>
			);

		});

		return (
			<div>
				<div className='row'>
					<div className='three columns'>TODO: date range selector here</div>
					<div className='three columns'>TODO: dropdown filters here</div>
					{ this.renderEvent(firstEvent) }
					{ this.renderEvent(secondEvent) }
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
