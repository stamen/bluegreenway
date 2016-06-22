import React, { PropTypes } from 'react';
import { throttle } from 'lodash';

import { Link } from 'react-router';

/**
 * Header block at top of site, with logo and nav links
 */

export default class Header extends React.Component {

	constructor (props) {
		super(props);
		this.onScroll = throttle(this.onScroll, 100);
		this.lastScrollTop = 0;
	}

	componentWillMount () {
		this.setState({
			headerHeight: null
		});
	}

	componentDidMount () {
		let headerHeight = this.refs.header.offsetHeight;
		this.lastScrollTop = window.scrollY;
		const delta = 5;

		if (!this.state.headerHeight || headerHeight !== this.state.headerHeight ) {
			this.setState({ headerHeight, delta });
		}
		window.addEventListener('scroll', this.onScroll.bind(this));
	}

	componentWillUnmount () {
		window.removeEventListener('scroll', this.onScroll.bind(this));
	}

	onScroll (e) {
		const { delta, headerHeight } = this.state;
		let scrollPos = window.scrollY;

		if (Math.abs(this.lastScrollTop - scrollPos) <= delta) return;

		if (scrollPos > this.lastScrollTop && scrollPos > headerHeight) {
			this.refs.header.classList.add('nav-up');
		} else if (scrollPos < headerHeight) {
			this.refs.header.classList.remove('nav-up');
		}

		this.lastScrollTop = scrollPos;
	}

	toggleMenu () {
		this.props.actions.menuToggle();
	}

	render () {
		// Don't let the body scroll if menu open
		document.body.style.overflow = (this.props.menuOpen ? 'hidden' : 'auto');

		return (
			<header ref='header' className={'site-header' + (this.props.menuOpen ? ' menu-open' : '')}>
				<h1><Link to='/'>BLUE<span className="site-header-green">GREENWAY</span></Link></h1>
				<ul>
					<li><Link to={`/stories`} onClick={this.toggleMenu.bind(this)} activeClassName='active'>Stories</Link></li>
					<li><Link to='/events' onClick={this.toggleMenu.bind(this)} activeClassName='active'>Events</Link></li>
					<li><Link to='/projects' onClick={this.toggleMenu.bind(this)} activeClassName='active'>Projects</Link></li>
					<li><Link to='/about' onClick={this.toggleMenu.bind(this)} activeClassName='active'>About</Link></li>
				</ul>
				<a className='site-header-show-menu' onClick={this.toggleMenu.bind(this)}>
					<div className='site-header-show-menu-bar'></div>
					<div className='site-header-show-menu-bar'></div>
					<div className='site-header-show-menu-bar'></div>
				</a>
			</header>
		);
	}

}
