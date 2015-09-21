/**
 * Created by Oscar on 11.09.15.
 */
var timeItemOptions;

timeItemOptions = {
    graph : {
        width: 960,
        height: 500,
        responsive: false
    },
    timeLine : {
        minDate: new Date(2015, 01, 01),
        maxDate: new Date(2015, 11, 31),
        showCurrentDate: true,
        showActualDate: true,
        currentDate: new Date(2012, 11, 31),
        actualDate: new Date(),
        zoomTimeLine: true
    },
    items : {
        dragmoveData: true,
        sizeItem: 10,
        zoomItem: true,
        tipItem: true,
        selectCategorie: true
    }
};
