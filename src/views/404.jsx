import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
	render () {
		return (
			<div style={ { padding: '2rem' } }>
				<h1>Oops! There's nothing here. Try <Link to='/' style={ { textDecoration: 'underline' } }>zooming out to see the whole Blue Greenway</Link>.</h1>
			</div>
		);
	}
});
