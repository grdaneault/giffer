import { Map } from 'immutable';
import * as constants from '../constants';

const initialState = Map({
    movieMap: Map(),
    error: ""
});

const movies = (state = initialState, action) => {
    switch (action.type) {
        case constants.REQUEST_MOVIE:
            return state.setIn(['movieMap', action.movieId, 'isLoading'], true);
        case constants.RECEIVE_MOVIE:
            return state.withMutations((s) => {
                s.setIn(['movieMap', action.movieId], Map(action.movie));
                s.setIn(['movieMap', action.movieId, 'isLoading'], false);
                s.set('error', '');
            });
        case constants.RECEIVE_MOVIE_ERR:
            return state.set('error', action.message);
        default:
            return state;
    }
};

export default movies;
