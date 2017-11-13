import React from 'react';
import PropTypes from 'prop-types';

const Subtitle = ({subtitle}) => (
    <div>
        <h3>{subtitle.text}</h3>
        <em>{subtitle.start} to {subtitle.end} of {subtitle.movie_name}</em>
    </div>
);

Subtitle.propTypes = {
    subtitle: PropTypes.object.isRequired
};

export default Subtitle