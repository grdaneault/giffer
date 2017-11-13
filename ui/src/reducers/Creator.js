import { combineReducers } from 'redux'
import { SET_SUBTITLE_RANGE, RECEIVE_MOVIE_SUBTITLES, REQUEST_MOVIE_SUBTITLES} from '../actions/Creator'


const renderStart = (state = 0, action) => {
    switch (action.type) {
        case SET_SUBTITLE_RANGE:
            return action.start;
        default:
            return state
    }
};

const renderEnd = (state = 0, action) => {
    switch (action.type) {
        case SET_SUBTITLE_RANGE:
            return action.end;
        default:
            return state
    }
};


const subtitles = (state = {
    subtitles: {},
    isLoading: false,
    minId: -1,
    maxId: -1
}, action) => {
    switch (action.type) {
        case REQUEST_MOVIE_SUBTITLES:
            return {
                ...state,
                isLoading: true,
            };
        case RECEIVE_MOVIE_SUBTITLES:
            return {
                ...state,
                isLoading: false,
                subtitles: {...state.subtitles, ...action.subtitles},
                minId: state.minId === -1 ? action.start : Math.min(action.start, state.minId),
                maxId: state.maxId === -1 ? action.end : Math.max(action.end, state.maxId)
            };
        default:
            return state;
    }
};

const subtitlesByIdByMovie = (state = { }, action) => {
    switch (action.type) {
        case REQUEST_MOVIE_SUBTITLES:
        case RECEIVE_MOVIE_SUBTITLES:
        case SET_SUBTITLE_RANGE:
            return {
                ...state,
                [action.movie.id]: subtitles(state[action.movie.id], action)
            };
        default:
            return state;
    }
};

const creatorReducers = {renderStart, renderEnd, subtitlesByIdByMovie};

export default creatorReducers;