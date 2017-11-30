import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Button from 'material-ui/Button';

import 'rc-slider/assets/index.css';

import Slider from 'rc-slider';
import {setSubtitleRenderRange, fetchMovieSubtitlesIfNecessary, setMovie, triggerRender, updateRenderStatus} from "../actions/GifCreator";
import {fetchMovieIfNecessary} from "../actions/Movie";
import {CircularProgress} from "material-ui";


class GifCreationPage extends Component {
    static propTypes = {
        movie: PropTypes.object,
        subtitles: PropTypes.object.isRequired,
        gifCreator: PropTypes.object.isRequired,

        startId: PropTypes.number.isRequired,
        endId: PropTypes.number.isRequired,

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

    handleRenderClick() {
        const {dispatch, gifCreator} = this.props;
        console.log("Render started");
        dispatch(triggerRender(gifCreator.get('movieId'), gifCreator.get('startId'), gifCreator.get('endId')));
    }

    render() {
        const style = { float: 'left', width: 560, height: 400, marginBottom: 560, marginLeft: 50 };
        const parentStyle = { overflow: 'hidden' };
        const { movie, dispatch, startId, endId, subtitles, gifCreator, renderInProgress } = this.props;
        console.log("in progress", renderInProgress, gifCreator.get('renderState'));

        console.log("movie is ", movie);
        if (!movie) {
            return (
                <h1>Loading... <CircularProgress /></h1>
            )
        }

        if(!gifCreator.get('subtitlesLoading')) {

            const renderStyle = {visibility: gifCreator.get('url') ? 'visible': 'hidden'};

            let marks = subtitles.toMap().mapEntries(([key, val]) => [val.get('sub_id'), {
                style: {
                    width: '500px',
                    textAlign: 'left'
                },
                label: <span>{val.get('text').replace("\n", " / ")}</span>
            }]).toJS();

            console.log(gifCreator.getIn(['subtitles', 0, 'sub_id']), "to", gifCreator.getIn(['subtitles', -1, 'sub_id']));
            console.log(movie);
            // const marks = {0: "thing", 50: "other", 616: "stuff"};
            return (
                <div style={parentStyle}>
                    <h1>{movie.get('name')}</h1>
                    <img src={movie.get('cover_image')} width={200} />
                    <div style={style}>
                        <Slider.Range
                            vertical
                            min={gifCreator.getIn(['subtitles', 0, 'sub_id'])}
                            max={gifCreator.getIn(['subtitles', -1, 'sub_id'])}
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
                        <Button
                            raised
                            color="primary"
                            disabled={renderInProgress}
                            onClick={() => this.handleRenderClick()}>Render {renderInProgress && <CircularProgress size={24} style={ {
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: -12,
                            marginLeft: -12,
                        }} />}</Button>
                        {/*<p>status: {gifCreator.get('renderState')}</p>*/}
                        <div>
                            <img style={renderStyle} src={gifCreator.get('url')} />
                        </div>
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
    const { movies, gifCreator } = state;

    return {
        movie: movies.getIn(['movieMap', gifCreator.get('movieId')]),
        gifCreator: gifCreator,
        subtitles: gifCreator.get('subtitles'),
        startId: gifCreator.get('startId'),
        endId: gifCreator.get('endId'),
        renderInProgress: !(["SUCCESS", "FAILURE", "NOT STARTED"].includes(gifCreator.get('renderState'))) && gifCreator.get('renderId') !== ''
    };
};

export default connect(mapStateToProps)(GifCreationPage)
