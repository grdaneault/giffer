import * as constants from '../constants';
import { api } from '../api';

export const setSubtitleQuery = (query) => (dispatch) => {
    dispatch({
        type: constants.SET_SUBTITLE_QUERY,
        query: query
    });

    dispatch(setSearchPage(0));
};

export const setSearchPage = (page) => ({
    type: constants.SET_PAGE,
    page: parseInt(page, 10)
});

export const setSearchPageSize = (pageSize) => ({
    type: constants.SET_PAGE_SIZE,
    pageSize: parseInt(pageSize, 10)
});

export const requestSearchResults = () => ({
    type: constants.REQUEST_SEARCH_RESULTS,
});

export const receiveSearchResults = (json) => ({
    type: constants.RECEIVE_SEARCH_RESULTS,
    results: json.matches,
    totalResults: json.total
});

export const receiveSearchResultsError = (error) => ({
    type: constants.RECEIVE_SEARCH_RESULTS_ERR,
    error: error
});

const fetchSearchResults = (query, start) => dispatch => {
    console.log('fetch for', query, start);
    dispatch(requestSearchResults(query, start));
    return api.get(`/movie/subtitle?start=${start}&query=${query}`)
        .then(response => {console.log("RRRRRRR", response); dispatch(receiveSearchResults(response.data));})
        .catch(err => dispatch(receiveSearchResultsError(err.message)));
};

const shouldFetchSearchResults = (state) => {
    console.log(state, state.get('loading'));

    return true; //state.get('loading');
};

export const fetchSearchResultsIfNecessary = (query, start) => (dispatch, getState) => {
    if (shouldFetchSearchResults(getState().search, query)) {
        return dispatch(fetchSearchResults(query, start));
    } else {
        console.log("nope.")
    }
};
