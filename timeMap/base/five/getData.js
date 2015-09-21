/**
 * Created by Oscar on 20.09.15.
 */

var timeMapData = [
    {   "id": 1, "name": "Bulle", date: new Date(2014, 1, 10), "coordinates": [7.063768, 46.613474] },
    {   "id": 2, "name": "Romont", date: new Date(2014, 4, 5), "coordinates": [6.914822, 46.691155] },
    {   "id": 5, "name": "Fribourg Centre", date: new Date(2015, 4, 5), "coordinates": [7.158113, 46.803620] },
    {   "id": 25, "name": "hepia", date: new Date(2015, 4, 5), "coordinates": [6.114048,46.205445 ] }
];

var timeMapSVG = {
    country : "../maps/suisse.json " ,
    state : "../maps/states_che.json "
    //city : "maps/cities_che.json "
};

var timeMapOptions = {
    graph : {
        width: 960,
        height: 500,
        responsive: false
    },
    timeLine : {
        minDate: new Date(2010, 05, 01),
        maxDate: new Date(2015, 11, 31),
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
        tipItem: true
    }
};
