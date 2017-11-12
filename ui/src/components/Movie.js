import React from 'react';
import PropTypes from 'prop-types';

const Movie = ({movie}) => (
    <div>
        <h2>{movie.title}</h2>
        <img src={movie.coverImg} alt={movie.title} />
    </div>
);

Movie.propTypes = {
    movie: PropTypes.object.isRequired
};

export default Movie