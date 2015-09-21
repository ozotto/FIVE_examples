/**
 * Created by Oscar on 11.09.15.
 */
var timeItemData;
var categories, items;

timeItemData = {
    categories: [
        {id: 1, name: 'Sport'},
        {id: 2, name: 'News'},
        {id: 3, name: 'People'}
    ],
    items: [
        {id: 1, title: "Top Level", date: new Date(2014, 1, 10), categorie: 3 },
        {id: 2, title: "Level 2: A", date: new Date(2014, 2, 3), categorie: 1},
        {id: 3, title: "Son of A", date: new Date(2014, 3, 14), categorie: 2}
    ]
};

var timeItemOptions = {
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
    items : {
        dragmoveData: true,
        sizeItem: 10,
        zoomItem: true,
        tipItem: true,
        selectCategorie: true
    }
};
