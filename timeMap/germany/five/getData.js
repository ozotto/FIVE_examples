/**
 * Created by Oscar on 20.09.15.
 */
    
var timeMapData = [
    {   "id": 1, "name": "Berlin", date: new Date(2014, 1, 10), "coordinates": [13.407255, 52.518912] },
    {   "id": 2, "name": "Hanovre", date: new Date(2014, 4, 5), "coordinates": [9.750994, 52.375124] },
    {   "id": 5, "name": "Cologne", date: new Date(2015, 4, 5), "coordinates": [6.960467, 50.971775] },
    {   "id": 25, "name": "Ingolstadt", date: new Date(2015, 4, 5), "coordinates": [11.436634, 48.770702 ] }
];

var timeMapSVG = {
    country : "../maps/germany/germany.json ",
    state : "../maps/germany/states_deu.json"
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
