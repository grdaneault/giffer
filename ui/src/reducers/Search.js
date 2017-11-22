import * as constants from '../constants';
import { Map, List } from 'immutable';



const initialState = Map({
    loading: false,
    error: "",
    query: "",
    results: List(),
    totalResults: 0,
    page: 0,
    start: 0,
    pageSize: 20
});

const search = (state = initialState, action) => {
    switch (action.type) {
        case constants.SET_SUBTITLE_QUERY:
            return state.set('query', action.query);
        case constants.SET_PAGE:
            let start = action.page * state.get('pageSize') ;
            return state.set('page', action.page).set('start', start);
        case constants.SET_PAGE_SIZE:
            return state.withMutations(s => {
                // keep content the same as much as possible
                // (but still align with full page if necessary)
                let page = s.get('start') / action.pageSize;
                let start = page * action.pageSize;

                s.set('page', page);
                s.set('pageSize', action.pageSize);
                s.set('start', start)
            });
        case constants.REQUEST_SEARCH_RESULTS:
            return state.set('loading', true).set('error', '');
        case constants.RECEIVE_SEARCH_RESULTS:
            return state.withMutations(s => {
                s.set('results', action.results);
                s.set('totalResults', action.totalResults);
                s.set('loading', false);
            });
        case constants.RECEIVE_SEARCH_RESULTS_ERR:
            return state.withMutations(s => {
                s.set('loading', false);
                s.set('error', action.error);
            });
        default:
            return state;
    }
};

export default search;
