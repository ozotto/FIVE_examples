/**
 * Created by Oscar on 04.06.15.
 */
(function() {

    var timeMap = {
        version: "1.0.0",
        description: "FIVE Master Hes-so"
    };

    //Variables Graph --------------------------------------------------------------
    var checkData = false, valMsg;

    //Variables TimeLine -----------------------------------------------------------
    var timeLineHeight = 70;
    var customTimeFormat, valuesX, axiX, zoomTimeLine;
    var infoTimeLine, infoStartDate, infoEndDate, infoActualDate;
    var sizeLineTime, sizeInfoLineTime = 20;
    var actualLineTime, positionLineTime, timeLineZone;

    //Variables Map
    var mapData;
    var mapZoneHeight, path, zoomMap;
    var makeMap;
    var map;

    timeMap.drawGraph = function(){

        controlOptions();
        configureParamsGraph();
        configureTimeLine();
        controlData();
        if(checkData){

            configureMap();
            createLineTime();

        }else{
            showMsg(valMsg);
        }

    };

    function controlOptions(){

        if(timeMapOptions.graph.width == null) timeMapOptions.graph.width = 960;
        if(timeMapOptions.graph.height == null) timeMapOptions.graph.height = 500;
        if(timeMapOptions.graph.responsive == null) timeMapOptions.graph.responsive = true;

        if(timeMapOptions.timeLine.minDate == null) timeMapOptions.timeLine.minDate = new Date(2000, 0, 31);
        if(timeMapOptions.timeLine.showCurrentDate == null) timeMapOptions.timeLine.showCurrentDate = true;
        if(timeMapOptions.timeLine.maxDate == null) timeMapOptions.timeLine.maxDate = new Date(2018, 3, 30);
        if(timeMapOptions.timeLine.showActualDate == null) timeMapOptions.timeLine.showActualDate = true;
        if(timeMapOptions.timeLine.currentDate == null) timeMapOptions.timeLine.currentDate = new Date(2010,4,1);
        if(timeMapOptions.timeLine.actualDate == null) timeMapOptions.timeLine.actualDate = new Date();
        if(timeMapOptions.timeLine.zoomTimeLine == null) timeMapOptions.timeLine.zoomTimeLine = true;

        if(timeMapOptions.map.dragmoveData == null) timeMapOptions.map.dragmoveData = true;
        if(timeMapOptions.map.zoomMap == null) timeMapOptions.map.zoomMap = true;
        if(timeMapOptions.map.sizeItem == null) timeMapOptions.map.sizeItem = 5;
        if(timeMapOptions.map.tipCountry == null) timeMapOptions.map.tipCountry = false;
        if(timeMapOptions.map.tipState == null) timeMapOptions.map.tipState = false;
        if(timeMapOptions.map.tipCity == null) timeMapOptions.map.tipCity = false;
        if(timeMapOptions.map.tipItem == null) timeMapOptions.map.tipItem = false;

        validateOption();

    }

    function validateOption(){
        timeMap.options = {
            graph: {
                width   : timeMapOptions.graph.width,
                height  : timeMapOptions.graph.height,
                responsive  : timeMapOptions.graph.responsive
            },
            timeLine:{
                posYTimeline: timeMapOptions.graph.height-timeLineHeight,
                minDate : timeMapOptions.timeLine.minDate,
                maxDate : timeMapOptions.timeLine.maxDate,
                currentDate : timeMapOptions.timeLine.currentDate,
                actualDate  : timeMapOptions.timeLine.actualDate,
                showCurrentDate : timeMapOptions.timeLine.showCurrentDate,
                showActualDate : timeMapOptions.timeLine.showActualDate,
                zoomTimeLine : timeMapOptions.timeLine.zoomTimeLine
            },
            map:{
                dragmoveData : timeMapOptions.map.dragmoveData,
                zoomMap : timeMapOptions.map.zoomMap,
                sizeItem : timeMapOptions.map.sizeItem,
                tipCountry : timeMapOptions.map.tipCountry,
                tipState : timeMapOptions.map.tipState,
                tipCity : timeMapOptions.map.tipCity,
                tipItem : timeMapOptions.map.tipItem
            }
        }

    }

    function controlData(){
        mapData = timeMapData;

        timeMap.svg = {};
        if(mapData.length > 0){
            if(timeMapSVG.country == null && timeMapSVG.state == null) valMsg = 2; else{

                if(timeMapSVG.country == null) timeMap.svg.country = null; else timeMap.svg.country = timeMapSVG.country;
                if(timeMapSVG.state == null) timeMap.svg.state = null; else timeMap.svg.state = timeMapSVG.state;
                if(timeMapSVG.city == null) timeMap.svg.city = null; else timeMap.svg.city = timeMapSVG.state;

                checkData = true;

            }
        }else valMsg = 1;
    }

    function showMsg(valMsg){
        if(valMsg == 1) console.log("Please enter data");
        if(valMsg == 2) console.log("Please enter Map");
    }

    function configureParamsGraph(){

        if(timeMap.options.graph.responsive){

            timeMap.graph = d3.select("#timeMap")
                .append("svg")
                .attr("preserveAspectRatio", "xMidYMid")
                .attr("viewBox", "0 0 " + timeMap.options.graph.width + " " + timeMap.options.graph.height)
                .attr("width", timeMap.options.graph.width)
                .attr("height", timeMap.options.graph.height)
                .attr("class","timeline");

            var width = $("#timeMap").width(),
                aspect = 500 / 960,
                height = width * aspect;

            $(window).resize(function() {
                var width = $("#timeMap").width();
                timeMap.graph.attr("width", width);
                timeMap.graph.attr("height", width * aspect);
            });

        }else{

            timeMap.graph = d3.select("#timeMap")
                .append("svg")
                .attr("width", timeMap.options.graph.width)
                .attr("height", timeMap.options.graph.height)
                .attr("class","timeline");

        }

    }

    //---- Creation Configuration Timeline
    function configureTimeLine(){

        customTimeFormat = d3.time.format.multi([
            ["%H:%M", function(d) { return d.getHours(); }],
            ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
            ["%d", function(d) { return d.getDate() != 1; }],
            ["%b", function(d) { return d.getMonth(); }],
            ["%Y", function() { return true; }]
        ]);

        valuesX = d3.time.scale()
            .range([0, timeMap.options.graph.width])
            .domain([timeMap.options.timeLine.minDate, timeMap.options.timeLine.maxDate]);

        axiX = d3.svg.axis()
            .scale(valuesX)
            .tickFormat(customTimeFormat)
            .tickSize(20,0);

        zoomTimeLine = d3.behavior.zoom()
            .x(valuesX)
            .scaleExtent([0.1, 1000])
            .on("zoom", zoomed);

    }

    function createLineTime(){

        sizeLineTime = timeLineHeight -sizeInfoLineTime;

        //Zone TimeLine ------------------------------------------------------------------------------
        timeMap.zoneTimeLine = timeMap.graph.append("g")
            .attr("class", "zoneTimeLine")
            .attr("transform", "translate(0,"+ timeMap.options.timeLine.posYTimeline +")");

        //Information LineTime
        makeInfoTimeLine();

        //Creation LineTime
        makeInteractionTimeLine();


        timeLineZone.append("rect")
            .attr("class","zoneTime")
            .attr("width", timeMap.options.graph.width)
            .attr("height", sizeLineTime);

        timeLineZone.append("g")
            .attr("class", "x axis")
            .call(axiX)
            .selectAll("text")
            .attr("y", 6)
            .attr("x", 6)
            .style("text-anchor", "start");

        timeLineZone.selectAll("g.x.axis path")
            .attr("class", "lineAxeX");

        timeLineZone.selectAll("g.x.axis g.tick line")
            .attr("class", "axesTimeLine");

        //Actual Position LineTime
        if(timeMap.options.timeLine.showActualDate) makePositionActualTime();

        //Position in LineTime
        if(timeMap.options.timeLine.showCurrentDate) makePositionCurrentTime();

    }

    function makeInfoTimeLine(){

        var pos1, pos2, pos3;
        var cal1, cal2;

        cal1 = (timeMap.options.graph.width * 40) / 100;
        cal2 = (timeMap.options.graph.width * 82) / 100;

        pos1 = 5;
        pos2 = cal1 + 5;
        pos3 = cal2 + 5;

        infoTimeLine = timeMap.zoneTimeLine.append("g")
            .attr("class", "infoTimeline");

        infoTimeLine.append("rect")
            .attr("class","infoZoneTime")
            .attr("width", timeMap.options.graph.width)
            .attr("height", sizeInfoLineTime);

        infoTimeLine.append("line")
            .attr("class", "lineAxeX")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", timeMap.options.graph.width)
            .attr("x1", 0);

        infoStartDate = infoTimeLine.append("g")
            .attr("class", "startDate")
            .attr("transform", "translate("+pos1+",15)");

        infoStartDate.append("text").attr("class", "textStartDate")
            .text(function(d) { return "Start Date: "+formatDate(valuesX.domain()[0]);  });

        infoActualDate = infoTimeLine.append("g")
            .attr("class", "actualDate")
            .attr("transform", "translate("+pos2+",15)");

        infoActualDate.append("text").attr("class", "textActualDate")
            .text(function(d) { return "Current Date: "+formatDate(timeMap.options.timeLine.currentDate);  });

        infoEndDate = infoTimeLine.append("g")
            .attr("class", "endDate")
            .attr("transform", "translate("+pos3+",15)");

        infoEndDate.append("text").attr("class", "textEndDate")
            .text(function(d) { return "End Date: "+formatDate(valuesX.domain()[1]);  });
    }
    function makeInteractionTimeLine(){
        timeLineZone = timeMap.zoneTimeLine.append("g")
            .attr("class", "timelineZone")
            .attr("transform", "translate(0,"+ sizeInfoLineTime +")");

        if(timeMap.options.timeLine.zoomTimeLine){
            timeLineZone.call(zoomTimeLine);
        }

        if(timeMap.options.timeLine.showCurrentDate){
            timeLineZone.on("mousemove", function () {
                var xCoord = d3.mouse(this)[0];
                dragmovePosition(xCoord);
            });
        }
    }
    function makePositionActualTime(){
        actualLineTime = timeLineZone.append("g")
            .attr("class", "actualLineTime")
            .attr("transform", function(){
                var posline = valuesX(timeMap.options.timeLine.actualDate);
                return "translate("+posline+",0)";
            });

        actualLineTime.append("line")
            .attr("class", "lineActualTime")
            .attr("y2", sizeLineTime);
    }
    function makePositionCurrentTime(){
        positionLineTime = timeLineZone.append("g")
            .attr("class", "positionLineTime")
            .attr("transform", function(){
                var posline = valuesX(timeMap.options.timeLine.currentDate);
                return "translate("+posline+",0)";
            });

        positionLineTime.append("line")
            .attr("class", "linePositionTime")
            .attr("y1", 25)
            .attr("y2", sizeLineTime);

        positionLineTime.append("circle")
            .attr("class", "circlePositionTime")
            .attr("cy", 25 )
            .attr("r", 5)
    }

    //---- Creation Configuration Network
    function configureMap(){

        mapZoneHeight = timeMap.options.graph.height - timeLineHeight;

        timeMap.projection = d3.geo.albers()
            .center([0, 46.897707])
            .rotate([-8.257169, 0])
            .parallels([40, 50])
            .scale(11000)
            .translate([timeMap.options.graph.width / 2, (timeMap.options.graph.height -timeLineHeight) / 2 ]);

        path = d3.geo.path()
            .projection(timeMap.projection);

        zoomMap = d3.behavior.zoom()
            .scaleExtent([0.1, 1000])
            .on("zoom", zoomedMap);


        timeMap.tipCountry = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<span style='color:red'>"+ d.id + "</span>";
            });

        timeMap.tipState = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<span style='color:red'>" + d.properties.name + "</span>";
            });

        timeMap.tipCity = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<span style='color:red'>"+ d.properties.name +"</span>";
            });

        timeMap.tipItem = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                var date;
                date = formatDate(d.date);
                return "<span style='color:red'>" + d.name + "</span>" +
                    "<p>"+ date +"</p>";
                //return "<strong>Item:</strong> <span style='color:red'>" + d.name + "</span>";
            });


        defineZoneMap();

        makeMap = queue();
        if(timeMap.svg.country != null ) makeMap.defer(d3.json, timeMapSVG.country);
        if(timeMap.svg.state != null ) makeMap.defer(d3.json, timeMapSVG.state);
        if(timeMap.svg.city != null ) makeMap.defer(d3.json, timeMapSVG.city);
        makeMap.await(createMap);

    }

    function defineZoneMap(){
        timeMap.zoneMap = timeMap.graph.append("g")
            .attr("class", "zoneMap")
            .append("g")
            .attr("transform", "translate(0,0)");

        if(timeMap.options.map.zoomMap) timeMap.zoneMap.call(zoomMap);

        timeMap.zoneMap.append("rect")
            .attr("class","zoneMap")
            .attr("width", timeMap.options.graph.width)
            .attr("height", mapZoneHeight);

        map = timeMap.zoneMap.append("g");
    }

    function createMap(error, data1, data2, data3){
        if (error) return console.error(error);

        var country, state, city;

        if(timeMap.svg.country != null ){
            country = topojson.feature(data1, data1.objects.suisse).features;
        }

        if(timeMap.svg.state != null ){

            if(timeMap.svg.country != null )
                state = topojson.feature(data2, data2.objects.states).features; else
                state = topojson.feature(data1, data1.objects.states).features;

        }
        if(timeMap.svg.city != null ){

            if(timeMap.svg.country != null){

                if(timeMap.svg.state != null){
                    city = topojson.feature(data3, data3.objects.cities_che).features;
                }

            }else{

                if(timeMap.svg.state != null){
                    city = topojson.feature(data2, data2.objects.cities_che).features;
                }

            }
        }

        //Make Country
        if(country != null){
            map.append("g")
                .attr("id", "countrie")
                .selectAll("path")
                .data(country)
                .enter()
                .append("path")
                .attr("id", function(d) { return d.id; })
                .attr("class", "pathCountry ")
                .attr("d", path)
                .call(timeMap.tipCountry)
                .on('mouseover', function(d){
                    d3.select(this)
                        .transition()
                        .style("fill", "#FDFD96");
                    if(timeMap.options.map.tipCountry) timeMap.tipCountry.show(d);
                })
                .on("mouseout", function(d){
                    d3.select(this)
                        .transition()
                        .style("fill", "#77DD77")
                    if(timeMap.options.map.tipCountry) timeMap.tipCountry.hide(d);
                });;

        }

        //Make States
        if(state != null){

            map.append("g")
                .attr("id", "states")
                .selectAll("path")
                .data(state)
                .enter()
                .append("g")
                .attr("class", "state")
                .append("path")
                .attr("id", function(d) { return d.id; })
                .call(timeMap.tipState)
                .attr("class", function(d) { return "pathState "+d.properties.name; })
                .style("fill", "#77DD77")
                .attr("d", path)
                .on('mouseover', function(d){
                    d3.select(this)
                        .transition()
                        .style("fill", "#FDFD96");
                    if(timeMap.options.map.tipState) timeMap.tipState.show(d);
                })
                .on("mouseout", function(d){
                    d3.select(this)
                        .transition()
                        .style("fill", "#77DD77")
                    if(timeMap.options.map.tipState) timeMap.tipState.hide(d);
                });

        }

        //Make City
        if(city != null){

            map.append("g")
                .attr("id", "cities")
                .selectAll("path")
                .data(city)
                .enter()
                .append("path")
                .attr("class", function(d) { return "pathCities "+d.properties.name; })
                .attr("d", path)
                .call(timeMap.tipCity)
                .on('mouseover', function(d){
                    d3.select(this)
                        .transition()
                        .style("fill", "blue");
                    if(timeMap.options.map.tipCity) timeMap.tipCity.show(d);
                })
                .on("mouseout", function(d){
                    d3.select(this)
                        .transition()
                        .style("fill", "#000000")
                    if(timeMap.options.map.tipCity) timeMap.tipCity.hide(d);
                });

        }


        mapItems = map.append("g")
            .attr("id", "items")
            .call(timeMap.tipItem)
            .selectAll("path")
            .data(mapData)
            .enter()
            .append("g")
            .attr("class", "item")
            .attr("id", function(d){ return d.id; } )
            .attr("visible", false);


        if(!timeMap.options.map.dragmoveData) drawDataMap();

    }

    function drawDataMap(){
        mapItems.attr("visible", true)
            .append("circle")
            .attr("id", function(d){ return d.id;})
            .attr("class", function(d){ return "pathItems "+d.name })
            .attr("cx", projectionLatitute)
            .attr("cy", projectionlongitude)
            .attr("r", timeMap.options.map.sizeItem)
            .on('mouseover', function(d){
                d3.select(this)
                    .transition()
                    .style("fill", "orange");
                if(timeMap.options.map.tipItem) timeMap.tipItem.show(d);
            })
            .on("mouseout", function(d){
                d3.select(this)
                    .transition()
                    .style("fill", "white")
                if(timeMap.options.map.tipItem) timeMap.tipItem.hide(d);
            });
    }

    // Functions ---------------------------------------------------
    function dragmovePosition(xCoord) {

        var dateCurrent, ctlVisible;

        dateCurrent = valuesX.invert(xCoord);
        dateCurrent = formatDate(dateCurrent);

        d3.select(".textActualDate")
            .text(function(d) { return "Current Date: "+dateCurrent;  });
        d3.select(".positionLineTime").attr("transform", "translate(" + xCoord + ",0)");

        if(timeMap.options.timeLine.actualDate > valuesX.invert(xCoord)){
            d3.selectAll(".zoneMap").style("fill", "#ffffff");
        }else{
            d3.selectAll(".zoneMap").style("fill", "#f8f8f8");
        }

        //Items
        if(timeMap.options.map.dragmoveData){

            mapData.forEach(function(e){
                if (e.date <= valuesX.invert(xCoord)) {

                    d3.selectAll(".item").each(function (valuesItem) {
                        ctlVisible = d3.select(this).attr("visible");
                        if (e.id == valuesItem.id && ctlVisible == "false" ) {

                            d3.select(this)
                                .attr("visible", true)
                                .append("circle")
                                .attr("id", function(d){ return d.id;})
                                .attr("class", function(d){ return "pathItems "+d.name })
                                .attr("cx", projectionLatitute)
                                .attr("cy", projectionlongitude)
                                .attr("r", timeMap.options.map.sizeItem)
                                .on('mouseover', function(d){
                                    d3.select(this)
                                        .transition()
                                        .style("fill", "orange");
                                    if(timeMap.options.map.tipItem) timeMap.tipItem.show(d);
                                })
                                .on("mouseout", function(d){
                                    d3.select(this)
                                        .transition()
                                        .style("fill", "white")
                                    if(timeMap.options.map.tipItem) timeMap.tipItem.hide(d);
                                });


                        }

                    });

                }else{
                    d3.selectAll(".item").each(function (valuesItem) {
                        ctlVisible = d3.select(this).attr("visible");
                        if (e.id == valuesItem.id && ctlVisible == "true" ) {

                            d3.select(this).attr("visible", false);

                            d3.selectAll(".pathItems").each(function(val){
                                if(e.id == val.id){
                                    d3.select(this).remove();
                                }
                            })


                        }

                    });
                }
            });

        }

    }

    function zoomed(){

        timeMap.zoneTimeLine.select(".x.axis").call(axiX).selectAll("text")
            .attr("y", 6)
            .attr("x", 6).style("text-anchor", "start");

        //Current Date
        d3.select(".textStartDate")
            .text(function(d) { return "Start Date: "+formatDate(valuesX.domain()[0]);  });

        d3.select(".textEndDate")
            .text(function(d) { return "End Date: "+formatDate(valuesX.domain()[0]);  });

    }

    function zoomedMap() {

        map.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

        var sizeRadio
        sizeRadio = timeMap.options.map.sizeItem/zoomMap.scale();
        d3.selectAll(".pathItems").attr("r", sizeRadio );

    }

    function formatDate(date){
        var dd, mm, yyyy, dateFormat;
        dd = date.getDate();
        mm = date.getMonth()+1;
        yyyy = date.getFullYear();

        if(dd<10) {
            dd='0'+dd
        }

        if(mm<10) {
            mm='0'+mm
        }

        dateFormat = dd+'/'+mm+'/'+yyyy;
        return dateFormat;
    }

    function projectionLatitute(d){
        var latitude = d.coordinates[1];
        var longitude = d.coordinates[0];
        var coorGraph = timeMap.projection([longitude, latitude]);
        return coorGraph[0];
    }

    function projectionlongitude(d){
        var latitude = d.coordinates[1];
        var longitude = d.coordinates[0];
        var coorGraph = timeMap.projection([longitude, latitude]);
        return coorGraph[1];
    }

    window.timeMap = timeMap;

})();
timeMap.drawGraph();
