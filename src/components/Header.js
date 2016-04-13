import React, { PropTypes } from 'react';
import { Link } from 'react-router';

/**
 * Header block, with title, background image, current conditions component, and selected module title/description.
 */
export default class Header extends React.Component {

	static propTypes = {
		selectedCategory: PropTypes.object,
		selectedModule: PropTypes.object
	};

	static defaultProps = {
		selectedCategory: null,
		selectedModule: null
	};

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
					<li><Link to='/stories'>Stories</Link></li>
					<li><Link to='/events'>Events</Link></li>
					<li><Link to='/projects'>Projects</Link></li>
					<li><Link to='/about'>About</Link></li>
				</ul>
			</header>
		);

	}

}
