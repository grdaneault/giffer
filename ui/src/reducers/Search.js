import { combineReducers } from 'redux'
import {SET_SUBTITLE_QUERY, SET_SUBTITLE_PAGE, REQUEST_SEARCH_RESULTS, RECEIVE_SEARCH_RESULTS} from '../actions/Search'


const searchQuery = (state = '', action) => {
    switch (action.type) {
        case SET_SUBTITLE_QUERY:
            return action.query;
        default:
            return state;
    }
};

const searchPage = (state = 0, action) => {
    switch (action.type) {
        case SET_SUBTITLE_PAGE:
            return action.page * 20;
        default:
            return state;
    }
};


const search = (state = {
    isSearching: false,
    didInvalidate: false,
    results: [],
    total: 0,
    start: 0,
    size: 20
}, action) => {
    switch (action.type) {
        case SET_SUBTITLE_PAGE:
            return {
                ...state,
                didInvalidate: true,
            };
        case REQUEST_SEARCH_RESULTS:
            return {
                ...state,
                isSearching: true,
                didInvalidate: false
            };
        case RECEIVE_SEARCH_RESULTS:
            return {
                ...state,
                isSearching: false,
                didInvalidate: false,
                results: action.results,
                total: action.totalResults
            };
        default:
            return state;
    }
};

const searchResultsByQuery = (state = { }, action) => {
    switch (action.type) {
        case REQUEST_SEARCH_RESULTS:
        case RECEIVE_SEARCH_RESULTS:
        case SET_SUBTITLE_PAGE:
            return {
                ...state,
                [action.query]: search(state[action.query], action)
            };
        default:
            return state;
    }
};

const searchReducers = combineReducers({searchQuery, searchPage, searchResultsByQuery});

export default searchReducers;