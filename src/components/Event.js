import React, { PropTypes } from 'react';
import slug from 'slug';

const Event = (props) => {

	let eventStyle = { backgroundImage: '' },
		eventClassName = '',
		eventURL = props.url || '';

	if (props.photoURL) {
		eventStyle.backgroundImage = `url(${props.photoURL})`;
	} else {
		eventStyle.backgroundImage = `url(img/events-default-${props.defaultImageIndex}.jpg)`;
	}

	// if the event is on the homepage ditch extra classes
	if (props.homepage) {
		eventClassName='event-cell';
	} else {
		eventClassName='event-cell three columns';
	}

	// Strip the ?popup=1 if it exists
	eventURL = eventURL.replace('?popup=1', '');

	if (eventURL) {
		return (
			<div
				className={ eventClassName }
				style={ eventStyle }>
				<a href={ eventURL }>{ renderBody(props) }</a>
			</div>
		);
	} else {
		return (
			<div
				className={ eventClassName }
				style={ eventStyle }>
				{ renderBody(props) }
			</div>
		);
	}

};

function renderBody (props) {

	let categorySlug = props.category ? slug(props.category).toLowerCase() : '';
	if (props.muted) {

		return (
			<div className={ 'event-shade ' + categorySlug }></div>
		);

	} else {

		return (
			<div className={ 'event-shade ' + categorySlug }>
				{ (props.startDate.format('D-MMM') === props.endDate.format('D-MMM')) ?
					(<div className='event-date'>
						<span>{ props.startDate.format('MMM') }</span>
						<span>{ props.startDate.format('D') }</span>
					</div>) :
					(<div className='event-date-range'>
						<div>
							<span className="event-date-range-month">{ props.startDate.format('MMM') }</span>
							<span className="event-date-range-day">{ props.startDate.format('D') }</span>
						</div>
						<div className="event-date-range-separator">&mdash;</div>
						<div>
							<span className="event-date-range-month">{ props.endDate.format('MMM') }</span>
							<span className="event-date-range-day">{ props.endDate.format('D') }</span>
						</div>
					</div>)
				}
				<div className='event-details'>
					<p className='event-title'>{ props.title }</p>
					<p>Time: <span>{ (props.startDate.hour() === 0 && props.startDate.minute() === 0) ? 'all day' :  props.startDate.format('h:mm a') }</span></p>
					<p>Cost: <span>{ props.cost }</span></p>
				</div>
			</div>
		);

	}

}

Event.propTypes = {
	photoUrl: PropTypes.string,
	startDate: PropTypes.object,
	endDate: PropTypes.object,
	title: PropTypes.string,
	cost: PropTypes.string,
	defaultImageIndex: PropTypes.number,
	homepage: PropTypes.bool,
	muted: PropTypes.bool
};

export default Event;
