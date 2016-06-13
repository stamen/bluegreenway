import React, { PropTypes } from 'react';

const Story = (props) => {
  const { id, title, images, category, body, mode, router} = props;

  function viewStory() {
    const path = `/stories/${ mode }/${ title }?id=${ id }`;
    props.onClick({ title, id });
    router.push(path);
  }

  return (
    <div
      className='story-cell six columns'
      onClick={(() => viewStory())}
      style={{ backgroundImage: `url(${images[0].src})` }}
      >
      <div className='story-shade'>
        <div className="story-category">{ category }</div>
        <div className="story-text">
          <div className="story-title">{ title.replace(/_/g, ' ') }</div>
          <div className="story-body" dangerouslySetInnerHTML={{ __html: body}}></div>
        </div>
      </div>
    </div>
  );
};

export default Story;
