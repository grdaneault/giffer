import * as constants from '../constants'
import { api } from '../api'

export const setMovie = (movieId) => ({
    type: constants.SET_MOVIE,
    movieId
});

export const setSubtitleRenderRange = (start, end) => ({
    type: constants.SET_SUBTITLE_RANGE,
    start, end
});


export const requestMovieSubtitles = (movieId, start, end) => ({
    type: constants.REQUEST_MOVIE_SUBTITLES,
    movieId,
    start,
    end
});

export const receiveMovieSubtitles = (movieId, start, end, json) => ({
    type: constants.RECEIVE_MOVIE_SUBTITLES,
    subtitles: json,
    movieId,
    start,
    end
});

export const receiveMovieSubtitlesError =(message) => ({
    type: constants.RECEIVE_MOVIE_SUBTITLES_ERR
});

const fetchMovieSubtitles = (movieId, start, end) => dispatch => {
    dispatch(requestMovieSubtitles(movieId, start, end));
    return api.get(`/movie/${movieId}/subtitle/${start}:${end}`)
        .then(response => dispatch(receiveMovieSubtitles(movieId, start, end, response.data)))
        .catch(err => dispatch(receiveMovieSubtitlesError(err.message)));
};

const shouldFetchMovieSubtitles = (state) => {
    return !state.gifCreator.get('subtitlesLoading');
};

export const fetchMovieSubtitlesIfNecessary = (movieId, start, end) => (dispatch, getState) => {
    if (shouldFetchMovieSubtitles(getState())) {
        return dispatch(fetchMovieSubtitles(movieId, start, end));
    } else {
        console.log("not fetching subs.")
    }
};

export const renderGif = (movieId, startId, endId) => ({
    type: constants.RENDER_GIF_START,
    movieId,
    startId,
    endId
});

export const receiveGifStatus = (json) => ({
        type: constants.RECEIVE_GIF_STATUS,
        state: json.state,
        url: json.url,
        renderId: json.renderId
});

export const updateRenderStatus = (renderId) => dispatch => {
    return api.get(`/gif/status/${renderId}`)
        .then(result => {
            dispatch(receiveGifStatus(result.data));
            if (result.data.state !== "SUCCESS" && result.data.state !== "FAILURE") {
                setTimeout(function () {
                    console.log("delayed retry");
                    dispatch(updateRenderStatus(result.data.renderId))
                }, 1000);
            }
        });
};

export const triggerRender = (movieId, startId, endId) => dispatch => {
    console.log("triggered");
    dispatch(renderGif(movieId, startId, endId));

    return api.get(`/movie/${movieId}/subtitle/${startId}:${endId}/gif`)
        .then(result => {
            dispatch(receiveGifStatus(result.data));
            if (result.data.state !== "SUCCESS" && result.data.state !== "FAILURE") {
                setTimeout(function () {
                    console.log("delayed retry");
                    dispatch(updateRenderStatus(result.data.renderId))
                }, 1000);
            }
        });
};

