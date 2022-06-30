export const images = {
    "app-host" : "https://rygg-gaard.no/gaia/img/BluePlanet.png",
    "app-join" : "https://rygg-gaard.no/gaia/img/RedPlanet.png",
    "hm-play" : "https://rygg-gaard.no/quiz/img/PlayBtn.png",
    "hm-create" : "https://rygg-gaard.no/gaia/img/WhitePlanet.png",
    "hm-exit" : "https://rygg-gaard.no/gaia/img/BlackHex.png",
    "q-add" : "https://rygg-gaard.no/quiz/img/AddBtn.png",
    "q-edit" : "https://rygg-gaard.no/quiz/img/EditBtn.png",
    "q-edit-ok" : "https://rygg-gaard.no/gaia/img/YellowPlanet.png",
    "q-del" : "https://rygg-gaard.no/quiz/img/DeleteBtn.png",
    "q-save" : "https://rygg-gaard.no/gaia/img/TransdimHex.png",
    "q-play" : "https://rygg-gaard.no/quiz/img/PlayBtn.png",
    "hp-continue" : "https://rygg-gaard.no/gaia/img/BrownPlanet.png",
};

export const SERVER = "http://16.170.74.73:3001";

export const GameState = {
    LOADING : -2,
    WAIT_FOR_PLAYERS : -1,
    WAIT_FOR_ANSWERS : 0,
    WAIT_FOR_BETS : 1,
    SHOW_BETS : 2,
    SHOW_CORRECT : 3,
    SHOW_STANDINGS : 4,
}