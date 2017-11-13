export const SET_MOVIE = 'SET_MOVIE';
export const REQUEST_MOVIE = 'REQUEST_MOVIE';
export const RECEIVE_MOVIE = 'RECEIVE_MOVIE';


export const setMovie = (movieId) => ({
    type: SET_MOVIE,
    movieId
});

export const requestMovie = (movieId) => ({
    type: REQUEST_MOVIE,
    movieId
});

export const receiveMovie = (movieId, json) => ({
    type: RECEIVE_MOVIE,
    movieId,
    movie: json
});

const fetchMovie = (movieId) => dispatch => {
    dispatch(requestMovie(movieId));
    return fetch(`http://localhost:5000/api/v1/movie/${movieId}`)
        .then(response => response.json())
        .then(json => dispatch(receiveMovie(movieId, json)))
};

const shouldFetchMovie = (state, movieId) => {
    return true; //!state.movies.getIn(['movieMap', 'movieId', 'isLoading']);
};

export const fetchMovieIfNecessary = (movieId) => (dispatch, getState) => {
    if (shouldFetchMovie(getState(), movieId)) {
        return dispatch(fetchMovie(movieId));
    } else {
        console.log("nope.")
    }
};
