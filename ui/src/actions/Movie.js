import * as constants from "../constants";
import { api } from '../api';

export const requestMovie = (movieId) => ({
    type: constants.REQUEST_MOVIE,
    movieId
});

export const receiveMovie = (movieId, json) => ({
    type: constants.RECEIVE_MOVIE,
    movieId,
    movie: json
});

export const receiveMovieError = (error) => ({
    type: constants.RECEIVE_MOVIE_ERR
});

const fetchMovie = (movieId) => dispatch => {
    dispatch(requestMovie(movieId));
    return api.get(`/movie/${movieId}`)
        .then(response => dispatch(receiveMovie(movieId, response.data)))
        .catch(err => dispatch(receiveMovieError(err.message)));
};

const shouldFetchMovie = (state, movieId) => {
    return !state.movies.getIn(['movieMap', movieId, 'isLoading']);
};

export const fetchMovieIfNecessary = (movieId) => (dispatch, getState) => {
    if (shouldFetchMovie(getState(), movieId)) {
        return dispatch(fetchMovie(movieId));
    } else {
        console.log("nope.")
    }
};
