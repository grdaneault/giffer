import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import 'rc-slider/assets/index.css';

import Slider from 'rc-slider';
import {setSubtitleRenderRange, fetchMovieSubtitlesIfNecessary} from "../actions/Creator";
import {fetchMovieIfNecessary, setMovie} from "../actions/Movie";
import {triggerRender} from "../actions/Render";


class GifCreationPage extends Component {
    static propTypes = {
        movie: PropTypes.object.isRequired,
        movieId: PropTypes.number.isRequired,
        subtitles: PropTypes.object.isRequired,

        startId: PropTypes.number.isRequired,
        endId: PropTypes.number.isRequired,

        render: PropTypes.object.isRequired,

        dispatch: PropTypes.func.isRequired,

        // Injected by React Router
        children: PropTypes.node,
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    componentDidMount() {
        const { dispatch, match } = this.props;

        if (match && match.params.movieId && match.params.start) {
            const movieId = parseInt(match.params.movieId, 10);
            const baseId = parseInt(match.params.start, 10);
            dispatch(fetchMovieIfNecessary(movieId));
            dispatch(setMovie(movieId));

            dispatch(fetchMovieSubtitlesIfNecessary(movieId, Math.max(baseId - 10, 1), baseId + 10));
            dispatch(setSubtitleRenderRange(baseId, baseId));
        }
    }

    render() {
        const style = { float: 'left', width: 560, height: 400, marginBottom: 560, marginLeft: 50 };
        const parentStyle = { overflow: 'hidden' };
        const { movie, movieId, dispatch, startId, endId, subtitles, render } = this.props;
        console.log("RENDER", render);

        if (movieId && !subtitles.isLoading) {
            const renderStyle = {visibility: render.get('url') ? 'visible': 'hidden'};

            let marks = {};
            marks = Object.values(subtitles.subtitles).reduce((marks, subtitle) => {marks[subtitle.sub_id] = {
                style: {
                    width: '500px',
                    textAlign: 'left'
                },
                label: <span>{subtitle.text}</span>
            }; return marks}, marks);

            // const marks = {0: "thing", 50: "other", 616: "stuff"};
            return (
                <div style={parentStyle}>
                    <h1>{movie.name}</h1>
                    <img src={movie.cover_image} width={200} />
                    <div style={style}>
                        <Slider.Range
                            vertical
                            min={subtitles.minId}
                            max={subtitles.maxId}
                            marks={marks}
                            step={null}
                            onChange={range => {
                                console.log("Selected!", range);
                                dispatch(setSubtitleRenderRange(range[0], range[1]))
                            }}
                            allowCross={true}
                            defaultValue={[startId, endId]} />
                    </div>
                    <div>
                        <button onClick={(e) => {
                            const {movieId, startId, endId, dispatch} = this.props;
                            console.log("STARTING RENDER", movieId, startId, endId);
                            dispatch(triggerRender(movieId, startId, endId));
                        }}>Render</button>
                        {render.get('state') !== 'NOT STARTED' && <p>status: {render.get('state')}</p>}
                        <img style={renderStyle} src={render.get('url')} />
                    </div>
                </div>
            )
        } else {
            return (
                <div><h1>Loading!</h1></div>
            )
        }
    }
}

const mapStateToProps = state => {
    const { renderStart, renderEnd, movies, gifRender, subtitlesByIdByMovie } = state;

    return {
        movie: movies.getIn(['movieMap', movies.get('selectedMovieId')]),
        movieId: movies.get('selectedMovieId'),
        subtitles: subtitlesByIdByMovie[movies.get('selectedMovieId')],
        startId: renderStart,
        endId: renderEnd,
        render: gifRender
    };
};

export default connect(mapStateToProps)(GifCreationPage)
