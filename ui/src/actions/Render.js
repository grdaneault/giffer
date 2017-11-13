export const RENDER_GIF_START= 'RENDER_GIF_START';
export const RECEIVE_GIF_STATUS = 'RECEIVE_GIF_STATUS';


export const renderGif = (movieId, startId, endId) => ({
    type: RENDER_GIF_START,
    movieId,
    startId,
    endId
});

export const receiveGifStatus = (json) => ({
    type: RECEIVE_GIF_STATUS,
    status: json.status,
    url: json.url,
    renderId: json.renderId
});

export const triggerRender = (movieId, startId, endId) => dispatch => {
    dispatch(renderGif(movieId, startId, endId));

    return fetch(`http://localhost:5000/api/v1/movie/${movieId}/subtitle/${startId}:${endId}/gif`)
        .then(response => response.json())
        .then(json => dispatch(receiveGifStatus(json)));
};

