import { combineReducers } from 'redux'
import movies from "./Movie";
import {renderStart, renderEnd, subtitlesByIdByMovie} from "./Creator";
import search from "./Search";
import gifRender from "./GifRender";

const rootReducer = combineReducers({search, movies, renderStart, renderEnd, subtitlesByIdByMovie, gifRender});

export default rootReducer;