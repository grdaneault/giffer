import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchSearchResultsIfNecessary, setSubtitleQuery, setSubtitleQueryPage } from '../actions/Search'

import 'rc-slider/assets/index.css';

import Slider from 'rc-slider';
import {setSubtitleRenderRange} from "../actions/Creator";
import {fetchMovieIfNecessary, setMovie} from "../actions/Movie";


class GifCreationPage extends Component {
    static propTypes = {
        movie: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        }).isRequired,
        movies: PropTypes.object.isRequired,
        subtitles: PropTypes.object.isRequired,
        isRendering: PropTypes.bool,

        startId: PropTypes.number.isRequired,
        endId: PropTypes.number.isRequired,

        dispatch: PropTypes.func.isRequired,

        // Injected by React Router
        children: PropTypes.node,
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    componentDidMount() {
        const { dispatch, searchQuery, searchPage, size, match } = this.props;
        if (match && match.params.movieId) {
            dispatch(fetchMovieIfNecessary(match.params.movieId));
            dispatch(setMovie(match.params.movieId));
        }

        dispatch(fetchSearchResultsIfNecessary(searchQuery, searchPage * size))
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.searchQuery !== this.props.searchQuery) {
            const { dispatch, searchQuery, searchPage, size } = nextProps;
            dispatch(fetchSearchResultsIfNecessary(searchQuery, searchPage * size))
        }
    }


    render() {
        const style = { float: 'left', width: 160, height: 400, marginBottom: 160, marginLeft: 50 };
        const parentStyle = { overflow: 'hidden' };
        const { subtitles, dispatch, startId, endId } = this.props;
        const marks = subtitles.subtitles.map(subtitle => subtitle.text);

        console.log(marks);
        return (
            <div style={parentStyle}>
                <div style={style}>
                    <Slider
                        vertical
                        min={subtitles.minId}
                        max={subtitles.maxId}
                        marks={marks}
                        step={null}
                        onChange={range => {dispatch(setSubtitleRenderRange(range[0], range[1]))}}
                        defaultValue={[startId, endId]} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { renderStart, renderEnd, subtitlesByIdByMovie, movie, movies, isRendering } = state;

    const subtitles = movie ? subtitlesByIdByMovie[movie.id] : {subtitles: []};

    return {
        movie,
        movies,
        subtitles,
        startId: renderStart,
        endId: renderEnd,
        isRendering
    };
};

export default connect(mapStateToProps)(GifCreationPage)
