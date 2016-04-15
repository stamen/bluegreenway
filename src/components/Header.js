import React, { PropTypes } from 'react';
import { Link } from 'react-router';

/**
 * Header block at top of site, with logo and nav links
 */
export default class Header extends React.Component {

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
			<header className='site-header'>
				<h1><Link to='/'>BLUE GREENWAY</Link></h1>
				<ul>
					<li><Link to='/stories' activeClassName='active'>Stories</Link></li>
					<li><Link to='/events' activeClassName='active'>Events</Link></li>
					<li><Link to='/projects' activeClassName='active'>Projects</Link></li>
					<li><Link to='/about' activeClassName='active'>About</Link></li>
				</ul>
			</header>
		);

	}

}
