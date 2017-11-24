import { Map, List } from 'immutable';
import * as constants from '../constants'

const initialState = Map({
    subtitles: List(),
    subtitlesLoading: false,
    movieId: 0,
    startId: 0,
    endId: 0,
    renderId: "",
    renderInProgress: false,
    renderAttempts: 0,
    url: "",
    state: "NOT STARTED"
});

const gifCreator = (state = initialState, action) => {
    switch (action.type) {
        case constants.SET_MOVIE:
            return state.set('movieId', action.movieId);
        case constants.SET_SUBTITLE_RANGE:
            return state.merge({
                startId: action.start,
                endId: action.end
            });
        case constants.REQUEST_MOVIE_SUBTITLES:
            return state.set('subtitlesLoading', true);
        case constants.RECEIVE_MOVIE_SUBTITLES:
            return state.merge({
                subtitlesLoading: false,
                subtitles: action.subtitles
            });
        case constants.RENDER_GIF_START:
            return state.merge({
                renderId: action.renderId,
                renderInProgress: true
            });
        case constants.RECEIVE_GIF_STATUS:
            return state.merge({
                url: action.url,
                renderState: action.state,
                renderAttempts: state.get('renderAttempts'),
                renderInProgress: ["SUCCESS", "FAILURE", "NOT STARTED"].includes(action.state)
            });
        default:
            return state;
    }
};

export default gifCreator;
