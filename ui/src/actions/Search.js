export const SET_SUBTITLE_QUERY = 'SET_SUBTITLE_QUERY';
export const SET_SUBTITLE_PAGE = 'SET_SUBTITLE_PAGE';
export const REQUEST_SEARCH_RESULTS = 'REQUEST_SEARCH_RESULTS';
export const RECEIVE_SEARCH_RESULTS = 'RECEIVE_SEARCH_RESULTS';


export const setSubtitleQuery = (query) => ({
    type: SET_SUBTITLE_QUERY,
    query
});

export const setSubtitleQueryPage = (query, page) => ({
    type: SET_SUBTITLE_PAGE,
    query,
    page: parseInt(page, 10)
});

export const requestSearchResults = (query, start) => ({
    type: REQUEST_SEARCH_RESULTS,
    query,
    start
});

export const receiveSearchResults = (query, json) => ({
    type: RECEIVE_SEARCH_RESULTS,
    query,
    results: json.matches,
    totalResults: json.total
});

const fetchSearchResults = (query, start) => dispatch => {
    dispatch(requestSearchResults(query, start));
    return fetch(`/api/v1/movie/subtitle?start=${start}&query=${query}`)
        .then(response => response.json())
        .then(json => dispatch(receiveSearchResults(query, json)))
};

const shouldFetchSearchResults = (state, query) => {
    const results = state.searchResultsByQuery[query];

    if (!results) {
        return true;
    }

    if (results.isSearching) {
        return false;
    }

    return results.didInvalidate;
};

export const fetchSearchResultsIfNecessary = (query, start) => (dispatch, getState) => {
    if (shouldFetchSearchResults(getState(), query)) {
        return dispatch(fetchSearchResults(query, start));
    } else {
        console.log("nope.")
    }
};
