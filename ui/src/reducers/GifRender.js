import { Map } from 'immutable';
import {RECEIVE_GIF_STATUS, RENDER_GIF_START} from "../actions/Render";


const initialState = Map({
    renderInProgress: false,
    movieId: 0,
    startId: 0,
    endId: 0,
    renderId: "",
    url: "",
    state: "NOT STARTED"
});

const gifRender = (state = initialState, action) => {
    switch (action.type) {
        case RENDER_GIF_START:
            return state
                .set('movieId', action.movieId)
                .set('startId', action.startId)
                .set('endId', action.endId)
                .set('renderId', action.renderId)
                .set('renderInProgress', true);
        case RECEIVE_GIF_STATUS:
            return state
                .set('url', action.url)
                .set('renderId', action.renderId)
                .set('state', action.state)
                .set('renderInProgress', action.state !== "SUCCESS");
        default:
            return state;
    }
};

export default gifRender;
