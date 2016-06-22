import React, { PropTypes } from 'react';
import slug from 'slug';

const Story = (props) => {
	const {
		id,
		title,
		images,
		category,
		body,
		mode,
		router
	} = props;

	let storyClassName = '';

	// if the story is on the homepage ditch extra classes
	if (props.homepage) {
		storyClassName='story-cell';
	} else {
		storyClassName='story-cell six columns';
	}

	function viewStory () {
		const path = `/stories/${ mode }/${ title }?id=${ id }`;
		props.onClick({ title, id });
		router.push(path);
	}

	return (
		<div
			className={ storyClassName }
			onClick={ () => viewStory() }
			style={ images.length ? { backgroundImage: `url(${images[0].src})` } : {} }
		>
			<div className='story-shade'>
				<div className={"story-category story-category-" + slug(category).toLowerCase()}>{ category }</div>
				<div className="story-text">
					<div className="story-title">{ title.replace(/_/g, ' ') }</div>
					<div className="story-body" dangerouslySetInnerHTML={ { __html: body} }></div>
				</div>
			</div>
		</div>
	);
};

export default Story;
