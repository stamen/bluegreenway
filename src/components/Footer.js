import React from 'react';
import socialMediaLinks from '../../static/socialMediaLinks.json';

/**
 * Footer block at bottom of site, with misc links and current weather/tide conditions
 */
export default (props) => (
	<footer className='site-footer'>
		<div className="grid-container">
			<div className="site-footer-row row">
				<div className="site-footer-column three columns">
					<div className="site-footer-advocate">The Blue Greenway is an advocacy and community engagement project of:</div>
					<a href="http://sfparksalliance.org" className="site-footer-sfpa-logo"></a>
				</div>
				<div className="site-footer-column three columns">
					<div className="site-footer-header">About</div>
					<p><a href="http://www.sfparksalliance.org/our-work/blue-greenway">The Blue Greenway</a></p>
					<p><a href="http://www.sfparksalliance.org/">San Francisco Parks Alliance</a></p>
				</div>
				<div className="site-footer-column three columns">
					<div className="site-footer-header">Contact</div>
					<p>
						415.621.3260<br />
						1663 Mission St, Suite 320<br />
						San Francisco, CA 94103
					</p>
					<p><a href="mailto:feedback@sfparksalliance.org">General feedback</a></p>
					<p><a href="mailto:feedback@sfparksalliance.org?subject=Add%20a%20Blue%20Greenway%20Event">Add your event</a></p>
				</div>
				<div className="menu-social-media site-footer-column three columns">
					<div className='menu-social-media-buttons'>
						<a href={ socialMediaLinks.facebook } className='menu-social-media-button menu-social-media-facebook'></a>
						<a href={ socialMediaLinks.twitter } className='menu-social-media-button menu-social-media-twitter'></a>
						<a href={ socialMediaLinks.instagram } className='menu-social-media-button menu-social-media-instagram'></a>
					</div>
					<p><a href="http://sfpa.convio.net/site/Survey?ACTION_REQUIRED=URI_ACTION_USER_REQUESTS&SURVEY_ID=1540">Subscribe to our newsletter</a></p>
				</div>
				{/*
				<div className="site-footer-column">
					Weather
				</div>
				*/}
			</div>
		</div>
	</footer>
);
