import React, { PropTypes } from 'react';
import { debounce } from 'lodash';

import { Link } from 'react-router';

/**
 * Header block at top of site, with logo and nav links
 */

let lastScrollTop = 0;

export default class Header extends React.Component {

	constructor (props) {

		super(props);
		this.onScroll = debounce(this.onScroll, 10);

	}

	componentWillMount () {
		this.setState({
			headerHeight: null
		});
	}

	componentDidMount () {
		let headerHeight = this.refs.header.offsetHeight;
		const delta = 5;
		const body = document.body;
		const html = document.documentElement;
		const height = Math.max(body.scrollHeight, body.offsetHeight,
			html.clientHeight, html.scrollHeight, html.offsetHeight);

		if (!this.state.headerHeight || headerHeight !== this.state.headerHeight ) {
			this.setState({ headerHeight, delta, body, html, height });
		}
		window.addEventListener('scroll', this.onScroll.bind(this));
	}

	componentWillUpdate () {
		window.removeEventListener('scroll', this.onScroll.bind(this));
	}

	componentDidUpdate () {
		//
	}

	componentWillUnmount () {
		//
	}

	onScroll (e) {
		const { delta, body, html, headerHeight, height } = this.state;
		let scrollPos = window.scrollY;

		if (Math.abs(lastScrollTop - scrollPos) <= delta) return;

		if (scrollPos > lastScrollTop && scrollPos > headerHeight) {
			this.refs.header.classList.add('nav-up');
		} else if (scrollPos + window.innerHeight < height) {
			this.refs.header.classList.remove('nav-up');
		}

		lastScrollTop = scrollPos;
	}

	render () {
		// to do: add :mode in the to={...} so that Links remain active on sub routes?
		// let mode = this.props.store.getState().mode;

		return (
			<header ref='header' className='site-header'>
				<h1><Link to='/'>BLUE<span className="site-header-green">GREENWAY</span></Link></h1>
				<ul>
					<li><Link to={`/stories`} activeClassName='active'>Stories</Link></li>
					<li><Link to='/events' activeClassName='active'>Events</Link></li>
					<li><Link to='/projects' activeClassName='active'>Projects</Link></li>
					<li><Link to='/about' activeClassName='active'>About</Link></li>
				</ul>
			</header>
		);

	}

}
