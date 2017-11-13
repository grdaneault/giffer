export const SET_SUBTITLE_RANGE = 'SET_SUBTITLE_RANGE';
export const REQUEST_MOVIE_SUBTITLES = 'REQUEST_MOVIE_SUBTITLES';
export const RECEIVE_MOVIE_SUBTITLES = 'RECEIVE_MOVIE_SUBTITLES';


export const setSubtitleRenderRange = (start, end) => ({
    type: SET_SUBTITLE_RANGE,
    start, end
});


export const requestMovieSubtitles = (movie, start, end) => ({
    type: REQUEST_MOVIE_SUBTITLES,
    movie,
    start,
    end
});

export const receiveMovieSubtitles = (movie, start, end, json) => ({
    type: RECEIVE_MOVIE_SUBTITLES,
    subtitles: json,
    movie,
    start,
    end
});

const fetchMovieSubtitles = (movie, start, end) => dispatch => {
    dispatch(requestMovieSubtitles(movie, start, end));
    return fetch(`http://localhost:5000/api/v1/movie/${movie.id}/subtitle/${start}:${end}`)
        .then(response => response.json())
        .then(json => dispatch(receiveMovieSubtitles(movie, start, end, json)))
};

const shouldFetchMovieSubtitles = (state, movie, start, end) => {
    const { isFetchingSubs } = state;
    const subs = state.subtitlesByIdByMovie[movie.id];

    if (isFetchingSubs) {
        return false;
    }

    for (let i = start; i <= end; i++) {
        if (!subs.hasOwnProperty(i)) {
            return true;
        }
    }

    return false;
};

export const fetchMovieSubtitlesIfNecessary = (movie, start, end) => (dispatch, getState) => {
    if (shouldFetchMovieSubtitles(getState(), movie, start, end)) {
        return dispatch(fetchMovieSubtitles(movie, start, end));
    } else {
        console.log("nope.")
    }
};
