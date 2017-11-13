export const SET_SUBTITLE_RANGE = 'SET_SUBTITLE_RANGE';
export const REQUEST_MOVIE_SUBTITLES = 'REQUEST_MOVIE_SUBTITLES';
export const RECEIVE_MOVIE_SUBTITLES = 'RECEIVE_MOVIE_SUBTITLES';


export const setSubtitleRenderRange = (start, end) => ({
    type: SET_SUBTITLE_RANGE,
    start, end
});


export const requestMovieSubtitles = (movieId, start, end) => ({
    type: REQUEST_MOVIE_SUBTITLES,
    movieId,
    start,
    end
});

export const receiveMovieSubtitles = (movieId, start, end, json) => ({
    type: RECEIVE_MOVIE_SUBTITLES,
    subtitles: json,
    movieId,
    start,
    end
});

const fetchMovieSubtitles = (movieId, start, end) => dispatch => {
    dispatch(requestMovieSubtitles(movieId, start, end));
    return fetch(`http://localhost:5000/api/v1/movie/${movieId}/subtitle/${start}:${end}`)
        .then(response => response.json())
        .then(json => dispatch(receiveMovieSubtitles(movieId, start, end, json)))
};

const shouldFetchMovieSubtitles = (state, movie, start, end) => {
    const { isFetchingSubs } = state;
    const subs = state.subtitlesByIdByMovie[movie.id];

    if (isFetchingSubs) {
        return false;
    }

    return true;
};

export const fetchMovieSubtitlesIfNecessary = (movieId, start, end) => (dispatch, getState) => {
    if (shouldFetchMovieSubtitles(getState(), movieId, start, end)) {
        return dispatch(fetchMovieSubtitles(movieId, start, end));
    } else {
        console.log("not fetching subs.")
    }
};
