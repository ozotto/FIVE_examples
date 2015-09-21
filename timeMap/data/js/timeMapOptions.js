/**
 * Created by Oscar on 11.09.15.
 */
var timeMapOptions;


timeMapOptions = {
    graph : {
        width: 960,
        height: 500,
        responsive: false
    },
    timeLine : {
        minDate: new Date(2015, 05, 01),
        maxDate: new Date(2015, 09, 31),
        showCurrentDate: true,
        showActualDate: true,
        currentDate: new Date(2012, 11, 31),
        actualDate: new Date(),
        zoomTimeLine: true
    },
    map : {
        dragmoveData: true,
        sizeItem: 5,
        zoomMap: true,
        tipCountry: true,
        tipState: true,
        tipCity: true,
        tipItem: true,
    }
};

var timeMapSVG = {
    country : "../maps/suisse.json ",
    state : "../maps/states_che.json "
    //city : "../maps/cities_che.json "
};