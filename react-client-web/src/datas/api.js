import $ from "jquery";

const API_URL = "http://localhost:8000";

/**
 * Squelette pour tous les appels api ajax
 * @param {string} path
 * @param {string} method POST ou GET
 * @param {Object} data (default : {})
 * @return {*}
 */
function ajax(path, method, data = {}){
    return $.ajax(
        `${API_URL}${path}`,
        {
            type: method,
            data: data
        }
    ).done((response) => {
        return response;
    }).fail((error) => {
        console.error(error);
    })
}

export function getAllScores(){
    return ajax("/get/tri/score");
}

export function getOneBoard(pseudo){
    return ajax("/get/" + pseudo);
}

export function setOneScore(pseudo, score, best_time, average_time){
    return ajax("/set", {
        pseudo: pseudo, score: score, best_time: best_time, average_time: average_time
    });
}