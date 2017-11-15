import { combineReducers } from 'redux'
import movies from "./Movie";
import {renderStart, renderEnd, subtitlesByIdByMovie} from "./Creator";
import {searchPage, searchQuery, searchResultsByQuery} from "./Search";
import gifRender from "./GifRender";

const rootReducer = combineReducers({searchPage, searchQuery, searchResultsByQuery, movies, renderStart, renderEnd, subtitlesByIdByMovie, gifRender});

export default rootReducer;