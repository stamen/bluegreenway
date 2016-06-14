import React from 'react';

const Event = (event) => {
  console.log(event.homepage);
  let eventStyle = { backgroundImage: '' };
  let eventClassName = '';

  if (event.photoURL) {
    eventStyle.backgroundImage = `url(${event.photoURL})`;
  } else {
    eventStyle.backgroundImage = `url(img/events-default-${event.defaultImageIndex}.jpg)`;
  }

  // if the event is on the homepage ditch extra classes
  if (event.homepage) {
    eventClassName='event-cell';
  } else {
    eventClassName='event-cell three columns';
  }

  return (
    <div
      className={eventClassName}
      style={eventStyle}>
      <div className='event-shade'>
        { (event.startDate.format('D-MMM') === event.endDate.format('D-MMM')) ?
          (<div className='event-date'>
            <span>{ event.startDate.format('MMM') }</span>
            <span>{ event.startDate.format('D') }</span>
          </div>) :
          (<div className='event-date-range'>
            <div>
              <span className="event-date-range-month">{ event.startDate.format('MMM') }</span>
              <span className="event-date-range-day">{ event.startDate.format('D') }</span>
            </div>
            <div className="event-date-range-separator">&mdash;</div>
            <div>
              <span className="event-date-range-month">{ event.endDate.format('MMM') }</span>
              <span className="event-date-range-day">{ event.endDate.format('D') }</span>
            </div>
          </div>)
        }
        <div className='event-details'>
          <p className='event-title'>{ event.title }</p>
          <p>Time: <span>{ (event.startDate.hour() === 0 && event.startDate.minute() === 0) ? 'all day' :  event.startDate.format('h:mm a') }</span></p>
          <p>Cost: <span>{ event.cost }</span></p>
        </div>
      </div>
    </div>
  );
};

export default Event;
