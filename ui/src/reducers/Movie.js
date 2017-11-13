import { Map } from 'immutable';
import {SET_MOVIE, RECEIVE_MOVIE, REQUEST_MOVIE } from '../actions/Movie';


const initialState = Map({
    movieMap: Map(),
    selectedMovieId: undefined
});

const movies = (state = initialState, action) => {
    switch (action.type) {
        case SET_MOVIE:
            return state.set('selectedMovieId', action.movieId);
        case REQUEST_MOVIE:
            return state.setIn(['movieMap', action.movieId, 'isLoading'], true);
        case RECEIVE_MOVIE:
            console.log("GOT MOVIE!", action.movie);
            return state.setIn(['movieMap', action.movieId], action.movie);
        default:
            return state;
    }
};

export default movies;
