import React, { PropTypes } from 'react';
import { throttle } from 'lodash';

import { Link } from 'react-router';

import socialMediaLinks from '../../static/socialMediaLinks.json';

/**
 * Header block at top of site, with logo and nav links
 */

export default class Header extends React.Component {

	static propTypes = {
		actions: PropTypes.object,
		menuOpen: PropTypes.bool,
		mode: PropTypes.string
	}

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

	render () {
		// Don't let the body scroll if menu open
		document.body.classList.toggle('mobile-menu-open', this.props.menuOpen);

		return (
			<header ref='header' className={ 'site-header' + (this.props.menuOpen ? ' menu-open' : '') }>
				<h1><Link to={ `/home/${ this.props.mode }` } onClick={ this.props.actions.menuHidden }>BLUE<span className="site-header-green">GREENWAY</span></Link></h1>
				<div className='menu'>
					<ul>
						<li><Link to={ `/about/page` } onClick={ this.props.actions.menuHidden } activeClassName='active'><span>About</span></Link></li>
						<li><Link to={ `/projects/${ this.props.mode }` } onClick={ this.props.actions.menuHidden } activeClassName='active'><span>Projects</span></Link></li>
						<li><Link to={ `/events/${ this.props.mode }` } onClick={ this.props.actions.menuHidden } activeClassName='active'><span>Events</span></Link></li>
						<li><Link to={ `/stories/${ this.props.mode }` } onClick={ this.props.actions.menuHidden } activeClassName='active'><span>Stories</span></Link></li>
					</ul>
					<div className='menu-social-media'>
						<div className='menu-social-media-buttons'>
							<a href={ socialMediaLinks.facebook } className='menu-social-media-button menu-social-media-facebook'></a>
							<a href={ socialMediaLinks.twitter } className='menu-social-media-button menu-social-media-twitter'></a>
							<a href={ socialMediaLinks.instagram } className='menu-social-media-button menu-social-media-instagram'></a>
						</div>
					</div>
				</div>
				<a className='site-header-toggle-menu' onClick={ this.props.actions.menuToggled }>
					<div className='site-header-show-menu'>
						<div className='site-header-show-menu-bar'></div>
						<div className='site-header-show-menu-bar'></div>
						<div className='site-header-show-menu-bar'></div>
					</div>
					<div className='site-header-hide-menu'>&#10005;</div>
				</a>
			</header>
		);
	}

}
