/**
 * Created by Oscar on 02.06.15.
 */
(function() {

    var timeNet = {
        version: "1.0.0",
        description: "FIVE Master Hes-so"
    };

    //Variables Graph --------------------------------------------------------------
    var checkData = false;

    //Variables TimeLine -----------------------------------------------------------
    var timeLineHeight = 70;
    var customTimeFormat, valuesX, axiX, zoomTimeLine;
    var infoTimeLine, infoStartDate, infoEndDate, infoActualDate;
    var sizeLineTime, sizeInfoLineTime = 20;
    var actualLineTime, positionLineTime, timeLineZone;

    //Variables Network -----------------------------------------------------------
    var sourceData, links = [], items, countNode = [], items2 = [], links2 = [];
    var force;
    var random, randomMin, randomMax, valOld;
    var graphLinks, graphItems, linksEnter, nodesEnter;

    timeNet.drawGraph = function(){
        controlOptions();
        configureParamsGraph();
        configureTimeLine();
        controlData();
        if(checkData){

            configureNetwork();
            createNetwork();
            createLineTime();

        }else{
            showMsg();
        }
    };

    function controlOptions(){

        if(timeNetOptions.graph.width == null) timeNetOptions.graph.width = 960;
        if(timeNetOptions.graph.height == null) timeNetOptions.graph.height = 500;
        if(timeNetOptions.graph.responsive == null) timeNetOptions.graph.responsive = true;

        if(timeNetOptions.timeLine.minDate == null) timeNetOptions.timeLine.minDate = new Date(2000, 0, 31);
        if(timeNetOptions.timeLine.maxDate == null) timeNetOptions.timeLine.maxDate = new Date(2018, 3, 30);
        if(timeNetOptions.timeLine.showCurrentDate == null) timeNetOptions.timeLine.showCurrentDate = true;
        if(timeNetOptions.timeLine.showActualDate == null) timeNetOptions.timeLine.showActualDate = true;
        if(timeNetOptions.timeLine.currentDate == null) timeNetOptions.timeLine.currentDate = new Date(2010,4,1);
        if(timeNetOptions.timeLine.actualDate == null) timeNetOptions.timeLine.actualDate = new Date();
        if(timeNetOptions.timeLine.zoomTimeLine == null) timeNetOptions.timeLine.zoomTimeLine = true;

        if(timeNetOptions.network.dragmoveData == null) timeNetOptions.network.dragmoveData = true;
        if(timeNetOptions.network.zoomNetwork == null) timeNetOptions.network.zoomNetwork = true;
        if(timeNetOptions.network.sizeNode == null) timeNetOptions.network.sizeNode = 10;
        if(timeNetOptions.network.sizeLink == null) timeNetOptions.network.sizeLink = 2;
        if(timeNetOptions.network.tipLink == null) timeNetOptions.network.tipLink = false;
        if(timeNetOptions.network.tipNode == null) timeNetOptions.network.tipNode = false;


        validateOption();
    }

    function validateOption(){
        timeNet.options = {
            graph: {
                width   : timeNetOptions.graph.width,
                height  : timeNetOptions.graph.height,
                responsive  : timeNetOptions.graph.responsive
            },
            timeLine:{
                posYTimeline: timeNetOptions.graph.height-timeLineHeight,
                minDate : timeNetOptions.timeLine.minDate,
                maxDate : timeNetOptions.timeLine.maxDate,
                currentDate : timeNetOptions.timeLine.currentDate,
                actualDate  : timeNetOptions.timeLine.actualDate,
                showCurrentDate : timeNetOptions.timeLine.showCurrentDate,
                showActualDate : timeNetOptions.timeLine.showActualDate,
                zoomTimeLine : timeNetOptions.timeLine.zoomTimeLine
            },
            network:{
                dragmoveData : timeNetOptions.network.dragmoveData,
                zoomNetwork : timeNetOptions.network.zoomNetwork,
                sizeNode    : timeNetOptions.network.sizeNode,
                sizeLink    : timeNetOptions.network.sizeLink,
                tipLink : timeNetOptions.network.tipLink,
                tipNode : timeNetOptions.network.tipNode
            }
        }
    }

    function controlData(){
        sourceData = timeNetData;
        items = sourceData.nodes;

        var targetInLink, sourceInLink;

        sourceData.links.forEach(function(e) {
            var sourceNode = sourceData.nodes.filter(function(n) { return n.id === e.source; })[0],
                targetNode = sourceData.nodes.filter(function(n) { return n.id === e.target; })[0];
            links.push({id: e.id, source: sourceNode, target: targetNode, date: e.date });
        });

        sourceData.nodes.forEach(function(e) {
            var countSource = 0, countTarget = 0;
            sourceData.links.forEach(function(n) { if(n.source === e.id) countSource++ });
            sourceData.links.forEach(function(n) { if(n.target === e.id) countTarget++ });

            targetInLink = searchIdTarget(e.id, links);
            sourceInLink = searchIdSource(e.id, links);

            if(sourceInLink || targetInLink){
                countNode.push({id: e.id, count_source: countSource, count_target: countTarget, sourceVisible: 0, targetVisible: 0});
            }

        });

        if(sourceData.nodes.length > 0 && links.length > 0) checkData = true;
    };

    function showMsg(){
        console.log("Please enter data");
    }

    function configureParamsGraph(){

        if(timeNet.options.graph.responsive){

            timeNet.graph = d3.select("#timeNet")
                .append("svg")
                .attr("preserveAspectRatio", "xMidYMid")
                .attr("viewBox", "0 0 " + timeNet.options.graph.width + " " + timeNet.options.graph.height)
                .attr("width", timeNet.options.graph.width)
                .attr("height", timeNet.options.graph.height)
                .attr("class","timeline");

            var width = $("#timeNet").width(),
                aspect = 500 / 960,
                height = width * aspect;

            $(window).resize(function() {
                var width = $("#timeNet").width();
                timeNet.graph.attr("width", width );
                timeNet.graph.attr("height", width * aspect);
            });

        }else{

            timeNet.graph = d3.select("#timeNet")
                .append("svg")
                .attr("width", timeNet.options.graph.width)
                .attr("height", timeNet.options.graph.height)
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
            .range([0, timeNet.options.graph.width])
            .domain([timeNet.options.timeLine.minDate, timeNet.options.timeLine.maxDate]);

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
        timeNet.zoneTimeLine = timeNet.graph.append("g")
            .attr("class", "zoneTimeLine")
            .attr("transform", "translate(0,"+ timeNet.options.timeLine.posYTimeline +")");

        //Information LineTime
        makeInfoTimeLine();

        //Creation LineTime
        makeInteractionTimeLine();

        timeLineZone.append("rect")
            .attr("class","zoneTime")
            .attr("width", timeNet.options.graph.width)
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
        if(timeNet.options.timeLine.showActualDate) makePositionActualTime();

        //Position in LineTime
        if(timeNet.options.timeLine.showCurrentDate) makePositionCurrentTime();


    }

    function makeInfoTimeLine(){

        var pos1, pos2, pos3, sizeText;
        var cal1, cal2;

        cal1 = (timeNet.options.graph.width * 40) / 100;
        cal2 = (timeNet.options.graph.width * 82) / 100;

        pos1 = 5;
        pos2 = cal1 + 5;
        pos3 = cal2 + 5;

        infoTimeLine = timeNet.zoneTimeLine.append("g")
            .attr("class", "infoTimeline");

        infoTimeLine.append("rect")
            .attr("class","infoZoneTime")
            .attr("width", timeNet.options.graph.width)
            .attr("height", sizeInfoLineTime);

        infoTimeLine.append("line")
            .attr("class", "lineAxeX")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", timeNet.options.graph.width)
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
            .text(function(d) { return "Current Date: "+formatDate(timeNet.options.timeLine.currentDate);  });

        infoEndDate = infoTimeLine.append("g")
            .attr("class", "endDate")
            .attr("transform", "translate("+pos3+",15)");

        infoEndDate.append("text").attr("class", "textEndDate")
            .text(function(d) { return "End Date: "+formatDate(valuesX.domain()[1]);  });

    }
    function makeInteractionTimeLine(){
        timeLineZone = timeNet.zoneTimeLine.append("g")
            .attr("class", "timelineZone")
            .attr("transform", "translate(0,"+ sizeInfoLineTime +")");

        if(timeNet.options.timeLine.zoomTimeLine){
            timeLineZone.call(zoomTimeLine);
        }

        if(timeNet.options.timeLine.showCurrentDate){
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
                var posline = valuesX(timeNet.options.timeLine.actualDate);
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
                var posline = valuesX(timeNet.options.timeLine.currentDate);
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
    function configureNetwork(){
        var sourceInLink, targetInLink;

        force = d3.layout.force()
            .charge(-120)
            .linkDistance(30)
            .size([timeNet.options.graph.width, (timeNet.options.graph.height - timeLineHeight - 50)]);

        force.nodes(items)
            .links(links)
            .start();

        items.forEach(function(e){
            random = Math.floor(Math.random() * (timeNet.options.timeLine.posYTimeline/2) ) + 10;
            randomMin = random - 20;
            randomMax = random + 20;
            if(valOld >= randomMin && valOld <= randomMax) random = Math.floor(Math.random() * 380 ) + 10;
            if(random > timeNet.options.timeLine.posYTimeline) random = Math.floor(Math.random() * (timeNet.options.timeLine.posYTimeline/2) ) + 10;

            targetInLink = searchIdTarget(e.id, links);
            sourceInLink = searchIdSource(e.id, links);

            if(sourceInLink || targetInLink){
                items2.push({
                    date: e.date,
                    id: e.id,
                    index: e.index,
                    title: e.title,
                    px: e.px,
                    py: random,
                    weight: e.weight,
                    x:e.x,
                    y: random
                });
                valOld = random
            }

        });

        links.forEach(function(e){

            var sourceNodeData = items2.filter(function(n) { return n.id === e.source.id; })[0],
                targetNodeData = items2.filter(function(n) { return n.id === e.target.id; })[0];

            links2.push({
                date: e.date,
                id: e.id,
                source: sourceNodeData,
                target: targetNodeData
            })
        });


        timeNet.tipItem = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                var date;
                date = formatDate(d.date);
                return "<span style='color:red'>" + d.title + "</span>" +
                    "<p>"+ date +"</p>";

            });

        timeNet.tipLink = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                var date;
                date = formatDate(d.date);
                return "<span style='color:red'>" + d.source.title +" - "+ d.target.title + "</span>" +
                    "<p>"+ date +"</p>";
            });

    }

    function createNetwork(){

        //Zone Network ------------------------------------------------------------------------------
        timeNet.zoneNetwork = timeNet.graph.append("g")
            .attr("class", "zoneNetwork");

        if(timeNet.options.network.zoomNetwork) timeNet.zoneNetwork.call(zoomTimeLine);

        timeNet.zoneNetwork.append("rect")
            .attr("class","backgroundNetwork")
            .attr("width", timeNet.options.graph.width)
            .attr("height", (timeNet.options.graph.height - timeLineHeight) );

        graphLinks = timeNet.zoneNetwork.append("g")
            .attr("class", "links")
            //.attr("transform", "translate(0,20)");
            .attr("transform", "translate(0,0)");

        graphItems = timeNet.zoneNetwork.append("g")
            .attr("class", "items");

        //Items
        makeItemsNetwork();

        //Links
        makeLinksNetwork();

        if(!timeNet.options.network.dragmoveData) drawNetwork();
    }

    function makeItemsNetwork(){
        nodesEnter = graphItems.selectAll("nodes")
            .data(items2)
            .enter()
            .append("g")
            .attr("class", "item")
            .attr("id", function(d){ return d.id; } )
            .attr("visible", false)
            .call(timeNet.tipItem);
    }

    function makeLinksNetwork(){
        linksEnter = graphLinks.selectAll("links")
            .data(links2)
            .enter()
            .append("g")
            .attr("class", "link")
            .attr("id", function(d){ return d.id; } )
            .attr("visible", false)
            .call(timeNet.tipLink)
            .on('mouseover', function(d){
                if(timeNet.options.network.tipLink) timeNet.tipLink.show(d);
            })
            .on("mouseout", function(d){
                if(timeNet.options.network.tipLink) timeNet.tipLink.hide(d);
            });
    }

    function drawNetwork(){
        nodesEnter.attr("visible", true)
            .append("circle")
            .attr("id", function(d){ return d.id;})
            .attr("class", "node")
            .attr("r", timeNet.options.network.sizeNode)
            .attr('stroke-width',2)
            .attr("cx", function(d) { return valuesX(d.date); })
            //.attr("cy", function(d) { return (d.y +20 ); })
            .attr("cy", function(d) { return (d.y ); })
            .on('mouseover', mouseOverNode)
            .on('mouseout', mouseOutNode);

        linksEnter.attr("visible", true)
            .append("line")
            .attr("class", "pathLink")
            .attr("id", function(d) { return d.id; })
            .attr("x1", function(d) { return valuesX(d.source.date); })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return valuesX(d.target.date); })
            .attr("y2", function(d) { return d.target.y; })
            .style("stroke-width", timeNet.options.network.sizeLink);
    }

    // Functions ---------------------------------------------------
    function dragmovePosition(xCoord) {

        var dateCurrent, ctlVisible, ctlVisibleLink;
        var ctlSource, ctlTarget, itemValue;

        var itemSourceInsert, itemTargetInsert;

        dateCurrent = valuesX.invert(xCoord);
        dateCurrent = formatDate(dateCurrent);

        if(timeNet.options.timeLine.actualDate > valuesX.invert(xCoord)){
            d3.selectAll(".backgroundNetwork").style("fill", "#ffffff");
        }else{
            d3.selectAll(".backgroundNetwork").style("fill", "#f8f8f8");
        }


        d3.select(".textActualDate").text(function(d) { return "Current Date: "+dateCurrent;  });

        d3.select(".positionLineTime").attr("transform", "translate(" + xCoord + ",0)");

        //Items
        if(timeNet.options.network.dragmoveData){

            links.forEach(function(e) {
                //Control date link
                if (e.date <= valuesX.invert(xCoord)) {

                    //Control date items Target and Source
                    if( e.source.date <= valuesX.invert(xCoord) && e.target.date <= valuesX.invert(xCoord) ){



                        //Insert Items
                        d3.selectAll(".item").each(function (valuesItem) {
                            ctlVisible = d3.select(this).attr("visible");

                            //Source
                            if (e.source.id == valuesItem.id && ctlVisible == "false" ) {

                                d3.select(this)
                                    .attr("visible", true)
                                    .append("circle")
                                    .attr("id", function(d){ return d.id;})
                                    .attr("class", "node")
                                    .attr("r", timeNet.options.network.sizeNode)
                                    .attr('stroke-width',2)
                                    .attr("cx", function(d) { return valuesX(d.date); })
                                    //.attr("cy", function(d) { return (d.y +20 ); })
                                    .attr("cy", function(d) { return (d.y ); })
                                    .on('mouseover', mouseOverNode)
                                    .on('mouseout', mouseOutNode);

                                itemSourceInsert = e.source.id;

                            }

                            //Target
                            if (e.target.id == valuesItem.id && ctlVisible == "false" ) {

                                d3.select(this)
                                    .attr("visible", true)
                                    .append("circle")
                                    .attr("id", function(d){ return d.id;})
                                    .attr("class", "node")
                                    .attr("r",timeNet.options.network.sizeNode)
                                    .attr('stroke-width',2)
                                    .attr("cx", function(d) { return valuesX(d.date); })
                                    //.attr("cy", function(d) { return (d.y +20 ); })
                                    .attr("cy", function(d) { return (d.y ); })
                                    .on('mouseover', mouseOverNode)
                                    .on('mouseout', mouseOutNode);

                                itemTargetInsert = e.target.id;
                            }


                        });

                        //Insert Links
                        d3.selectAll(".link").each(function (valuesLink) {
                            ctlVisibleLink = d3.select(this).attr("visible");

                            //Link
                            if (e.id == valuesLink.id && ctlVisibleLink == "false" ) {

                                //if(itemSourceInsert == e.source.id && itemTargetInsert == e.target.id ){

                                    d3.select(this)
                                        .attr("visible", true)
                                        .append("line")
                                        .attr("class", "pathLink")
                                        .attr("id", function(d) { return d.id; })
                                        .attr("x1", function(d) { return valuesX(d.source.date); })
                                        .attr("y1", function(d) { return d.source.y; })
                                        .attr("x2", function(d) { return valuesX(d.target.date); })
                                        .attr("y2", function(d) { return d.target.y; })
                                        .style("stroke-width", timeNet.options.network.sizeLink);

                                    //Count items visible
                                    countNode.forEach(function(infoNode){
                                        if(infoNode.id == e.source.id)
                                            infoNode.sourceVisible = infoNode.sourceVisible + 1;

                                        if(infoNode.id == e.target.id)
                                            infoNode.targetVisible = infoNode.targetVisible + 1;

                                    });

                                //}



                            }

                        });

                    }


                }else{

                    d3.selectAll(".link").each(function (valuesLink) {
                        ctlVisibleLink = d3.select(this).attr("visible");

                        if (e.id == valuesLink.id && ctlVisibleLink == "true" ) {

                            var ItemToDelete = d3.select(this);
                            var dataTarget, dataSource;
                            var ctlTargetItem, ctlSourceItem;


                            //Delete Item
                            ItemToDelete.attr("visible", false);

                            //Delete Link
                            d3.selectAll(".pathLink").each(function(val){

                                //Look target
                                dataTarget = val.target;
                                dataSource = val.source;

                                if(e.id == val.id){
                                    if(val.date > valuesX.invert(xCoord)){
                                        d3.select(this).remove();

                                        //Count items visible
                                        countNode.forEach(function(infoNode){
                                            if(infoNode.id == e.source.id)
                                                infoNode.sourceVisible = infoNode.sourceVisible - 1;
                                            if(infoNode.id == e.target.id)
                                                infoNode.targetVisible = infoNode.targetVisible - 1;
                                        });
                                    }

                                    ctlTargetItem = searchById(dataTarget.id, countNode);
                                    if(ctlTargetItem.sourceVisible <= 0 && ctlTargetItem.targetVisible <= 0){
                                        d3.selectAll(".item").each(function (valuesItem) {
                                            itemValue = this;
                                            if(ctlTargetItem.id == valuesItem.id){
                                                d3.select(itemValue).attr("visible", false);
                                            }
                                        });

                                        d3.selectAll(".node").each(function(values_nodes){
                                            if(ctlTargetItem.id == values_nodes.id){
                                                d3.select(this).remove();


                                            }
                                        });


                                    }

                                    ctlSourceItem = searchById(val.source.id, countNode);
                                    if(ctlSourceItem.sourceVisible <= 0 && ctlSourceItem.targetVisible <= 0){

                                        d3.selectAll(".item").each(function (valuesItem) {
                                            itemValue = this;
                                            if (ctlSourceItem.id == valuesItem.id){
                                                d3.select(itemValue).attr("visible", false);
                                            }
                                        });

                                        d3.selectAll(".node").each(function(values_nodes) {
                                            if (ctlSourceItem.id == values_nodes.id) {
                                                d3.select(this).remove();

                                            }
                                        });

                                    }

                                }


                            });


                        }

                    });

                }
            });

        }
    }

    function searchById(valueId, myArray){
        for (var i=0; i < myArray.length; i++) {
            if (myArray[i].id === valueId) {
                return myArray[i];
            }
        }
    }

    function searchIdTarget(valueId, myArray){
        for (var i=0; i < myArray.length; i++) {
            if (myArray[i].target.id === valueId) {
                return myArray[i];
            }
        }
    }

    function searchIdSource(valueId, myArray){
        for (var i=0; i < myArray.length; i++) {
            if (myArray[i].source.id === valueId) {
                return myArray[i];
            }
        }
    }

    function zoomed() {

        timeNet.zoneTimeLine.select(".x.axis").call(axiX).selectAll("text")
            .attr("y", 6)
            .attr("x", 6).style("text-anchor", "start");

        //Current Date
        d3.select(".textStartDate")
            .text(function(d) { return "Start Date: "+formatDate(valuesX.domain()[0]);  });

        d3.select(".textEndDate")
            .text(function(d) { return "End Date: "+formatDate(valuesX.domain()[0]);  });


        var sizeStroke, sizeRadio;

        //Config size Nodes and links
        if(timeNet.options.network.zoomNetwork){
            sizeStroke = timeNet.options.network.sizeLink * zoomTimeLine.scale();

            if(sizeStroke <= 1) sizeStroke = 1;
            if(sizeStroke >= 5) sizeStroke = 5;

            sizeRadio = timeNet.options.network.sizeNode * zoomTimeLine.scale();
            if(sizeRadio >= 40) sizeRadio = 40;
            if(sizeRadio <= 4) sizeRadio = 4;
        }else{
            sizeStroke = timeNet.options.network.sizeLink;
            sizeRadio = timeNet.options.network.sizeNode;
        }

        //Moving Link and Node
        timeNet.zoneNetwork.selectAll(".pathLink")
            .attr("x1", function (d) { return valuesX(d.source.date); })
            .attr("x2", function (d) { return valuesX(d.target.date); })
            .style("stroke-width", sizeStroke);

        timeNet.zoneNetwork.selectAll(".node")
            .attr("cx", function (d) { return valuesX(d.date); })
            .attr("r", sizeRadio );


    }

    function mouseOverNode(d){

        if(timeNet.options.network.tipNode) timeNet.tipItem.show(d);

        d3.selectAll(".item").sort(function (a, b) {
            if (a.id != d.id) return -1;
            else return 1;
        });

        d3.select(this)
            //.transition()
            .style("fill", "orange")
            .style("stroke", "black");

        sourceData.links.forEach(function(e) {
            //Links Source
            if(e.source == d.id){
                d3.selectAll(".pathLink").filter(function(data) { return data.id == e.id })
                    .style("stroke", "black");

                d3.selectAll(".node").filter(function(data) { return data.id == e.target })
                    .style("stroke", "black")
                    .style("fill", "orange");

            }
            //Links Target
            if(e.target == d.id){
                d3.selectAll(".pathLink").filter(function(data) { return data.id == e.id })
                    .style("stroke", "black");

                d3.selectAll(".node").filter(function(data) { return data.id == e.source })
                    .style("stroke", "black")
                    .style("fill", "orange");

            }
        });

    }

    function mouseOutNode(d){

        d3.select(this)
            .style("fill", "white")
            .style("stroke", "steelblue");

        if(timeNet.options.network.tipNode) timeNet.tipItem.hide(d);

        sourceData.links.forEach(function(e) {
            //Links Source
            if(e.source == d.id){
                d3.selectAll(".pathLink").filter(function(data) { return data.id == e.id })
                    .style("stroke", "#cccccc");

                d3.selectAll(".node").filter(function(data) { return data.id == e.target })
                    .style("stroke", "steelblue")
                    .style("fill", "white");
            }
            //Links Target
            if(e.target == d.id){
                d3.selectAll(".pathLink").filter(function(data) { return data.id == e.id })
                    .style("stroke", "#cccccc");

                d3.selectAll(".node").filter(function(data) { return data.id == e.source })
                    .style("stroke", "steelblue")
                    .style("fill", "white");

            }
        });
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

    window.timeNet = timeNet;

})();
timeNet.drawGraph();



