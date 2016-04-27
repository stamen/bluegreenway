import * as React from 'react';
import { Timeline } from 'react-twitter-widgets';

import PageHeader from '../components/PageHeader';

export default class About extends React.Component {

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
			<div id='about' className="grid-container">
				<PageHeader />
				<h2>Blue Greenway Vision Statement</h2>
				<p>The Blue Greenway is more than a trail; it is a unifying identity for the 13-mile corridor along San Francisco’s southeastern waterfront. The Blue Greenway will link established open spaces; create new recreational opportunities and green infrastructure; provide public access and retain and restore natural habitat areas; through the implementation of the San Francisco Bay Trail, Bay Area Water Trail, and green corridors to surrounding neighborhoods; install public art and interpretive elements; support stewardship; and advocate for waterfront access as an element of all planning and development processes over time.</p>
				<p>&mdash;Mayor Newsom’s 2006 Blue Greenway Task Force Vision Statement (updated)</p>
				<h2>About the Blue Greenway</h2>
				<div style={{ float: 'right' }}>
					<Timeline 
						options={{ height: 600 }}
						widgetId={'725404019116675072'} />
				</div>
				<p>The Blue Greenway is a multi-agency effort to create an interconnected system of trails and parks on San Francisco’s southeast waterfront. Once complete, it will transform this neglected resource into a premier series of public open spaces: 13 miles of waterfront parks and trails running from AT&T Park south to Candlestick Point. The Blue Greenway project will complete San Francisco’s portions of the Bay Trail and Bay Water Trail, and provide active transportation routes connecting San Francisco’s growing eastern neighborhoods with the employment centers of Mission Bay and downtown.</p>
				<p>The Blue Greenway is will also provide badly needed open space, recreation, and active transportation opportunities to the city’s lowest-income and most underserved neighborhoods.</p> 
				<p>These neighborhoods are slated to grow by more than 30,000 new residents over the next 20 years. The new open space network will connect these neighborhoods to their waterfront and serve as a catalyst for high-quality  development, employment opportunities and economic vitality. The southeastern neighborhoods have been plagued by the loss of the city’s maritime industries and the environmental contamination that these industries left behind. The Blue Greenway brings together numerous government, private sector, and nonprofit efforts to clean up toxic contaminants along the waterfront and turn these formerly unusable parcels of land into areas for public enjoyment, active recreation, and economic activity.</p> 
				<p>The San Francisco Parks Alliance is leading efforts to move the Blue Greenway from a vision to a reality! SFPA invites you to imagine the Blue Greenway. Enjoy 13 miles of new parks and trails along San Francisco’s southeast waterfront. Whether you live in Bayview or Hunters Point, work in SOMA, go to ballgames, or find it another way, the Blue Greenway will make it easy for you to get outside and connect to the Bay.</p>
			</div>
		);

	}

}
