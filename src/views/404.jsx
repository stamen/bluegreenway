import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
	render () {
		return (
			<div>
				<h1>Oops. Try going <Link to='/'>somewhere else</Link>.</h1>
			</div>
		);
	}
});
