var timeNetData,timeNetOptions;

timeNetData = {
        nodes: [
            {id: 1, date: new Date(2014, 1, 10), title: "Myriel"},
            {id: 2, date: new Date(2014, 2, 3), title: "Napoleon"},
            {id: 3, date: new Date(2015, 9, 14), title: "Mlle.Baptistine"},
            {id: 4, date: new Date(2015, 4, 4), title: "Mme.Magloire"}
        ],
        links: [
            {id: 1, source: 1, target: 2, date: new Date(2014, 8, 3) },
            {id: 2, source: 2, target: 3, date: new Date(2014, 3, 3) },
            {id: 3, source: 2, target: 4, date: new Date(2014, 6, 20) },
            {id: 4, source: 3, target: 4, date: new Date(2014, 10, 10) }
        ]
        };
    

timeNetOptions = {
        graph : {
            width: 960,
            height: 500,
            responsive: true
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
        network : {
            dragmoveData: true,
            zoomNetwork: true,
            sizeNode: 10,
            sizeLink: 2,
            tipLink: true,
            tipNode: true
        }
    };
