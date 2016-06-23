import React, { PropTypes } from 'react';
import slug from 'slug';

const Story = (props) => {
	let storyClassName = '';

	// if the story is on the homepage ditch extra classes
	if (props.homepage) {
		storyClassName='story-cell';
	} else {
		storyClassName='story-cell six columns';
	}

	function viewStory () {
		const path = `/stories/${ props.mode }/${ props.title }?id=${ props.id }`;
		let { title, id } = props; 
		props.onClick({ title, id });
		props.router.push(path);
	}

	return (
		<div
			className={ storyClassName }
			onClick={ () => viewStory() }
			style={ props.images.length ? { backgroundImage: `url(${ props.images[0].src })` } : {} }
		>
			<div className='story-shade'>
				<div className={ "story-category story-category-" + slug(props.category).toLowerCase() }>{ props.category }</div>
				<div className="story-text">
					<div className="story-title">{ props.title.replace(/_/g, ' ') }</div>
					<div className="story-body" dangerouslySetInnerHTML={ { __html: props.body } }></div>
				</div>
			</div>
		</div>
	);
};

Story.propTypes = {
	id: PropTypes.number,
	title: PropTypes.string,
	images: PropTypes.array,
	category: PropTypes.string,
	body: PropTypes.string,
	mode: PropTypes.string,
	router: PropTypes.object,
	homepage: PropTypes.bool,
	onClick: PropTypes.func
};

export default Story;
