/**
 * Created by Oscar on 04.06.15.
 * Mofify original Framework to custom Style
 */
(function() {

    var timeItem = {
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
    var widthLineTime;

    //Variable Items
    var dataItemsGraph =[], domainCategoriesGraph=[], dataCategoriesGraph=[];
    var heightCategorie, heightLastCategorie, rangeCategorieInitial;
    var valuesY, axiY;
    var widhCategories;
    var itemEnter, item;
    var zoneCategories;
    var posCategorieInitial = [], posItemsInitial = [];
    var positionCategories = [], positionItems = [];
    var sizeRadio;
    var countClicked = 0;
    var delayTransition = function(d,i){ return (i+1)*50; };
    var noSorted = true;
    var posYTimeline;
    var catSelected, isClicked = false;

    timeItem.drawGraph = function(){

        controlOptions();
        configureParamsGraph();
        controlData();
        if(checkData){

            configureCategories();
            configureTimeLine();
            createItems();

            createCategories();
            createLineTime();
            savePositionInitial();

        }else{
            showMsg();
        }

    };

    function controlOptions(){

        if(timeItemOptions.graph.width == null) timeItemOptions.graph.width = 960;
        if(timeItemOptions.graph.height == null) timeItemOptions.graph.height = 500;
        if(timeItemOptions.graph.responsive == null) timeItemOptions.graph.responsive = true;

        if(timeItemOptions.timeLine.minDate == null) timeItemOptions.timeLine.minDate = new Date(2000, 0, 31);
        if(timeItemOptions.timeLine.showCurrentDate == null) timeItemOptions.timeLine.showCurrentDate = true;
        if(timeItemOptions.timeLine.maxDate == null) timeItemOptions.timeLine.maxDate = new Date(2018, 3, 30);
        if(timeItemOptions.timeLine.showActualDate == null) timeItemOptions.timeLine.showActualDate = true;
        if(timeItemOptions.timeLine.currentDate == null) timeItemOptions.timeLine.currentDate = new Date(2010,4,1);
        if(timeItemOptions.timeLine.actualDate == null) timeItemOptions.timeLine.actualDate = new Date();
        if(timeItemOptions.timeLine.zoomTimeLine == null) timeItemOptions.timeLine.zoomTimeLine = true;

        if(timeItemOptions.items.dragmoveData == null) timeItemOptions.items.dragmoveData = true;
        if(timeItemOptions.items.sizeItem == null) timeItemOptions.items.sizeItem = 10;
        if(timeItemOptions.items.zoomItem == null) timeItemOptions.items.zoomItem = true;
        if(timeItemOptions.items.tipItem == null) timeItemOptions.items.tipItem = false;
        if(timeItemOptions.items.selectCategorie == null) timeItemOptions.items.selectCategorie = true;


        validateOption();

    }

    function validateOption(){
        timeItem.options = {
            graph: {
                width   : timeItemOptions.graph.width,
                height  : timeItemOptions.graph.height,
                responsive  : timeItemOptions.graph.responsive
            },
            timeLine:{
                posYTimeline: timeItemOptions.graph.height-timeLineHeight,
                minDate : timeItemOptions.timeLine.minDate,
                maxDate : timeItemOptions.timeLine.maxDate,
                currentDate : timeItemOptions.timeLine.currentDate,
                actualDate  : timeItemOptions.timeLine.actualDate,
                showCurrentDate : timeItemOptions.timeLine.showCurrentDate,
                showActualDate : timeItemOptions.timeLine.showActualDate,
                zoomTimeLine : timeItemOptions.timeLine.zoomTimeLine
            },
            items:{
                dragmoveData : timeItemOptions.items.dragmoveData,
                sizeItem : timeItemOptions.items.sizeItem,
                zoomItem : timeItemOptions.items.zoomItem,
                tipItem : timeItemOptions.items.tipItem,
                selectCategorie :timeItemOptions.items.selectCategorie
            }
        }
    }

    function controlData(){

        var idItem, idCat, nameCat, dateItem, NameItem;
        var dataItems = timeItemData;

        dataItems.categories.forEach(function(value){
            domainCategoriesGraph.push(value.id);
            dataCategoriesGraph.push({ id:value.id, name:value.name });
        });

        dataItems.items.forEach(function(value){
            idItem = value.id
            idCat = value.categorie;
            dataItems.categories.forEach(function(valueCat) {
                if(valueCat.id == idCat)     nameCat = valueCat.name;
            });

            dateItem = value.date;
            NameItem = value.title;
            dataItemsGraph.push({"idItem": idItem, "idCat": idCat, "nameCat":nameCat, "dateItem": dateItem, "NameItem":NameItem})
        });

        /*
        dataItemsGraph.forEach(function(value){
            domainCategoriesGraph.push(value.idCat);
            dataCategoriesGraph.push({ id:value.idCat, name:value.nameCat });
        });
        */

        if(dataCategoriesGraph.length > 0 && dataItemsGraph.length > 0 ) checkData = true;

        posYTimeline = timeItem.options.graph.height-timeLineHeight;
    }

    function showMsg(){
        console.log("Please enter data");
    }

    function configureParamsGraph(){

        if(timeItem.options.graph.responsive){

            timeItem.graph = d3.select("#timeItem")
                .append("svg")
                .attr("preserveAspectRatio", "xMidYMid")
                .attr("viewBox", "0 0 " + timeItem.options.graph.width + " " + timeItem.options.graph.height)
                .attr("width", timeItem.options.graph.width)
                .attr("height", timeItem.options.graph.height)
                .attr("class","timeline");

            var width = $("#timeItem").width(),
                //aspect = 500 / 960,
                aspect = timeItem.options.graph.height / timeItem.options.graph.width
                height = width * aspect;

            $(window).resize(function() {
                var width = $("#timeItem").width();
                timeItem.graph.attr("width", width);
                timeItem.graph.attr("height", width * aspect);
            });

        }else{

            timeItem.graph = d3.select("#timeItem")
                .append("svg")
                .attr("width", timeItem.options.graph.width)
                .attr("height", timeItem.options.graph.height)
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
            .range([0, (timeItem.options.graph.width - widhCategories)])
            .domain([timeItem.options.timeLine.minDate, timeItem.options.timeLine.maxDate]);

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
        widthLineTime = timeItem.options.graph.width - widhCategories;

        //Zone TimeLine ------------------------------------------------------------------------------
        timeItem.zoneTimeLine = timeItem.graph.append("g")
            .attr("class", "zoneTimeLine")
            .attr("transform", "translate("+widhCategories+","+ timeItem.options.timeLine.posYTimeline +")");

        //Information LineTime
        makeInfoTimeLine();

        //Creation LineTime
        makeInteractionTimeLine();


        timeLineZone.append("rect")
            .attr("class","zoneTime")
            .attr("width", widthLineTime)
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
        if(timeItem.options.timeLine.showActualDate) makePositionActualTime();

        //Position in LineTime
        if(timeItem.options.timeLine.showCurrentDate) makePositionCurrentTime();

    }

    function makeInfoTimeLine(){

        var pos1, pos2, pos3;

        var cal1, cal2;

        cal1 = (widthLineTime * 40) / 100;
        cal2 = (widthLineTime * 78) / 100;

        pos1 = 5;
        pos2 = cal1 + 5;
        pos3 = cal2 + 5;



        infoTimeLine = timeItem.zoneTimeLine.append("g")
            .attr("class", "infoTimeline");

        infoTimeLine.append("rect")
            .attr("class","infoZoneTime")
            .attr("width", widthLineTime)
            .attr("height", sizeInfoLineTime);

        infoTimeLine.append("line")
            .attr("class", "lineAxeX")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", widthLineTime)
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
            .text(function(d) { return "Current Date: "+formatDate(timeItem.options.timeLine.currentDate);  });

        infoEndDate = infoTimeLine.append("g")
            .attr("class", "endDate")
            .attr("transform", "translate("+pos3+",15)");

        infoEndDate.append("text").attr("class", "textEndDate")
            .text(function(d) { return "End Date: "+formatDate(valuesX.domain()[1]);  });


    }
    function makeInteractionTimeLine(){
        timeLineZone = timeItem.zoneTimeLine.append("g")
            .attr("class", "timelineZone")
            .attr("transform", "translate(0,"+ sizeInfoLineTime +")");

        if(timeItem.options.timeLine.zoomTimeLine){
            timeLineZone.call(zoomTimeLine);
        }

        if(timeItem.options.timeLine.showCurrentDate){
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
                var posline = valuesX(timeItem.options.timeLine.actualDate);
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
                var posline = valuesX(timeItem.options.timeLine.currentDate);
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

    //---- Creation Configuration Categories
    function configureCategories(){

        heightCategorie = (timeItem.options.graph.height - timeLineHeight) / domainCategoriesGraph.length;
        rangeCategorieInitial = timeItem.options.graph.height - timeLineHeight - heightCategorie;
        heightLastCategorie = rangeCategorieInitial / (domainCategoriesGraph.length - 1);


        widhCategories = (arrayMax(dataCategoriesGraph) * 100) / 10;
        if(widhCategories < 100) widhCategories = 100;
        //widhCategories = arrayMax(dataCategoriesGraph); //20 for caracter space

        valuesY = d3.scale.ordinal()
            .domain(domainCategoriesGraph)
            .rangePoints([rangeCategorieInitial, 0]);

        axiY = d3.svg.axis()
            .scale(valuesY)
            .orient("left");

        timeItem.tipItem = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                var date;
                date = formatDate(d.dateItem);
                return "<span style='color:red'>" + d.NameItem + "</span>" +
                    "<p>"+ date +"</p>";
            });

    }

    function createItems(){


        sizeRadio = timeItem.options.items.sizeItem;

        //Zone Items -------------------------------------------------------------
        timeItem.zoneItem = timeItem.graph.append("g")
            .attr("class", "zoneItem")
            .attr("transform", "translate(" + widhCategories + ",0)");
            if(timeItem.options.timeLine.zoomTimeLine){
                timeItem.zoneItem.call(zoomTimeLine);
            }

        item = timeItem.zoneItem.selectAll("item")
            .data(dataItemsGraph);

        itemEnter = item.enter().append("g")
            //.attr("class", "dataItem")
            .attr("class", function(d){ return "dataItem "+ "catID"+d.idCat })
            .attr("idItem", function(d){ return d.idItem })
            .attr('clicked', false)
            .attr('visible', false)
            .attr("idCategorie", function(d){ return d.idCat })
            .call(timeItem.tipItem)
            .on('mouseover', function(d){
                if(timeItem.options.items.tipItem) timeItem.tipItem.show(d);
            })
            .on("mouseout", function(d){
                if(timeItem.options.items.tipItem) timeItem.tipItem.hide(d);
            });

        if(!timeItem.options.items.dragmoveData) drawItems();
    }

    function drawItems(){
        itemEnter.attr("visible", true)
            .append("circle")
            .attr("class", function(d) { return "item idItem"+d.idItem+" item_idCat"+ d.idCat  ;  })
            .attr("cx", function(d){
                return xpos = valuesX(new Date(d.dateItem));
            } )
            .attr("cy", function(d){
                return ypos = valuesY(d.idCat) + (heightLastCategorie /2);
            } )
            .attr("r",sizeRadio)
            .attr('stroke-width',2)
            .attr('id',function(d) { return d.idItem;})
            .attr('idCat', function(d){ return d.idCat; })
            .attr("fill", "#ffffff")
            .on('mouseover', mouseOverNode)
            .on('mouseout', mouseOutNode);
/*            .on('mouseover', function(d){
                d3.select(this).style("fill","orange")
            })
            .on('mouseout', function(d){
                d3.select(this).style("fill","steelblue")
            });*/
    }

    function createCategories(){

        //Zone Categories -------------------------------------------------
        zoneCategories = timeItem.graph.append("g")
            .attr("class", "zoneCategories")
            .append("g");

        zoneCategories.append("rect")
            .attr("class","rectCategories")
            .attr("width", widhCategories)
            .attr("height", timeItem.options.graph.height)
            .attr("x", 0)
            .attr("y", 0);

        zoneCategories.append("line")
            .attr("class", "lineYaxi")
            .attr("x1", widhCategories)
            .attr("y1", timeItem.options.timeLine.posYTimeline)
            .attr("x2", widhCategories)
            .attr("y2", 0);

        //Axes Y categories
        zoneCategories.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + widhCategories + ",0)")
            .call(axiY)
            .selectAll(".tick")
            .attr("id", function(d) { return d })
            .attr("class", "tickCategorie")
            .attr("clicked", false)
            .on("mouseover", function(d) { mouseOverCategorie(d) })
            .on("mouseout", function(d) { mouseOutCategorie(d) })
            .on("click", function(d) { catSelected = d; mouseClickCategorie(d) });

        zoneCategories.selectAll(".tickCategorie")
            .selectAll("text").remove();

        zoneCategories.selectAll(".tickCategorie")
            .selectAll("line").remove();

        //Config Zone Categorie
        zoneCategories.selectAll(".tickCategorie")
            .append("rect")
            .attr("class", function(d) { return "zoneCategorie"+d+" fillCategorie";  })
            .attr("width", widhCategories)
            .attr("height", heightCategorie)
            .attr("x", -widhCategories)
            .attr("y", 1);

        //Config Line Limit Categorie
        zoneCategories.selectAll(".tickCategorie")
            .append("line")
            .attr("class", "lineAxeYitems")
            .attr("x1", -widhCategories)
            .attr("y1", heightCategorie)
            .attr("x2", 0)
            .attr("y2", heightCategorie);

        zoneCategories.selectAll(".tickCategorie")
            .append("line")
            .attr("class", "lineDivCate")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", (timeItem.options.graph.width - widhCategories))
            .attr("y2", 0);

        zoneCategories.selectAll(".tickCategorie")
            .append("text")
            .attr("class", "textCategorie")
            .attr("y", heightCategorie/2)
            .attr("x", -85)
            .style("text-anchor", "start")
            .text(function(d) {
                var nameCategorie = searchNameCategorie(d);
                return nameCategorie;
            });

        zoneCategories.selectAll("g.y.axis path")
            .attr("class", "lineAxeY");

    }

    // Functions ---------------------------------------------------
    function dragmovePosition(xCoord) {

        var dateCurrent, ctlVisible;
        var randomPos

        dateCurrent = valuesX.invert(xCoord);
        dateCurrent = formatDate(dateCurrent);

        if(timeItem.options.timeLine.actualDate > valuesX.invert(xCoord)){
            d3.select(".timeline").style("background", "#ffffff");
        }else{
            d3.select(".timeline").style("background", "#f8f8f8");
        }

        d3.select(".textActualDate")
            .text(function(d) { return "Current Date: "+dateCurrent;  });
        d3.select(".positionLineTime").attr("transform", "translate(" + xCoord + ",0)");

        //Items
        if(timeItem.options.items.dragmoveData){

            dataItemsGraph.forEach(function(e){
                if(e.dateItem <=  valuesX.invert(xCoord)){


                    timeItem.zoneItem.selectAll(".dataItem").each(function(valuesItem){
                        ctlVisible = d3.select(this).attr("visible");
                        if(e.idItem == valuesItem.idItem && ctlVisible == "false"){

                            //If categorie is selected
                            if(isClicked == true){

                                if(catSelected == valuesItem.idCat && ctlVisible == "false"){

                                    randomPos = Math.floor((Math.random() * (timeItem.options.timeLine.posYTimeline - (sizeRadio * 2) )) + sizeRadio);

                                    d3.select(this)
                                        .attr("visible", true)
                                        .append("circle")
                                        .attr("class", function(d) { return "item idItem"+d.idItem+" item_idCat"+ d.idCat  ;  })
                                        .attr("cx", function(d){
                                            return xpos = valuesX(new Date(d.dateItem));
                                        } )
                                        .attr("cy", randomPos)
                                        .attr("r",sizeRadio)
                                        .attr('stroke-width',2)
                                        .attr('id',function(d) { return d.idItem;})
                                        .attr('idCat', function(d){ return d.idCat; })
                                        .attr("fill", "#ffffff")
                                        .on('mouseover', mouseOverNode)
                                        .on('mouseout', mouseOutNode);

                                }

                            }else{

                                d3.select(this)
                                    .attr("visible", true)
                                    .append("circle")
                                    .attr("class", function(d) { return "item idItem"+d.idItem+" item_idCat"+ d.idCat  ;  })
                                    .attr("cx", function(d){
                                        return xpos = valuesX(new Date(d.dateItem));
                                    } )
                                    .attr("cy", function(d){
                                        return ypos = valuesY(d.idCat) + (heightLastCategorie /2);
                                    } )
                                    .attr("r",sizeRadio)
                                    .attr('stroke-width',2)
                                    .attr('id',function(d) { return d.idItem;})
                                    .attr('idCat', function(d){ return d.idCat; })
                                    .attr("fill", "#ffffff")
                                    .on('mouseover', mouseOverNode)
                                    .on('mouseout', mouseOutNode);
                                /*
                                    .on('mouseover', function(d){
                                        d3.select(this).style("fill","orange")
                                    })
                                    .on('mouseout', function(d){
                                        d3.select(this).style("fill","steelblue")
                                    });*/

                            }
                        }

                    });

                }else{
                    timeItem.zoneItem.selectAll(".dataItem").each(function(valuesItem){
                        ctlVisible = d3.select(this).attr("visible");
                        if(e.idItem == valuesItem.idItem && ctlVisible == "true"){

                            d3.select(this).attr("visible", false);

                            d3.selectAll(".item").each(function(val){

                                if(e.idItem == val.idItem){
                                    d3.select(this).remove();
                                }
                            });

                        }

                    });
                }
            });

        }

    }

    function mouseOverNode(d){

        //console.log(d);
        //d3.selectAll(".dataItem").sort(function (a, b) {
        d3.selectAll(".catID"+ d.idCat).sort(function (a, b) {
            if(d.idCat == a.idCat){
                if (a.idItem != d.idItem) return -1;
                else return 1;
            }

        });

        d3.select(this)
            .style("fill", "orange")
            .style("stroke", "black");

    }

    function mouseOutNode(d){

        d3.select(this)
            .style("fill", "white")
            .style("stroke", "steelblue");

    }

    function zoomed(){

        timeItem.zoneTimeLine.select(".x.axis").call(axiX).selectAll("text")
            .attr("y", 6)
            .attr("x", 6).style("text-anchor", "start");

        //Current Date
        d3.select(".textStartDate")
            .text(function(d) { return "Start Date: "+formatDate(valuesX.domain()[0]);  });

        d3.select(".textEndDate")
            .text(function(d) { return "End Date: "+formatDate(valuesX.domain()[0]);  });


        if(timeItemOptions.items.zoomItem) {
            sizeRadio = sizeRadio * zoomTimeLine.scale();
            if (sizeRadio >= 20) sizeRadio = 20;
            if (sizeRadio <= 4) sizeRadio = 4;
        }else{
            sizeRadio = sizeRadio;
        }

            d3.selectAll(".item")
                .attr("cx", function(d){
                    return xpos = valuesX(new Date(d.dateItem));
                } )
                .attr("r", sizeRadio );


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

    function arrayMax(arr) {
        var max, ini = 0;
        arr.forEach(function(d){
            d.name.length > ini ? max = d.name.length : max = ini;
            ini = max;
        } );
        return max;
    }

    function mouseOverCategorie(d){

        var tickCategorie = ".zoneCategorie"+ d;
        var idCat = ".item_idCat"+ d;

        //Line To Framework
        zoneCategories.select(tickCategorie)
            .attr("class", function(d) { return "zoneCategorie"+d+" zoneCategoriesHover";  });

        d3.selectAll(idCat)
            .style("fill","orange")
            .style("stroke", "black");

    }

    function mouseOutCategorie(d){

        var tickCategorie = ".zoneCategorie"+ d;
        var idCat = ".item_idCat"+ d;

        //Line To Framework
        zoneCategories.select(tickCategorie)
            .attr("class", function(d) { return "zoneCategorie"+d+" fillCategorie";  });

        timeItem.zoneItem.selectAll(idCat)
            .transition()
            .style("fill", "white")
            .style("stroke", "steelblue");

    }

    function mouseClickCategorie(d){


        var itemXpos, itemYpos, posZoneX, posZoneY, newPosY;
        countClicked++;
        var clicked;

        var randomPos, valuesRandom = [], ctlRandom;

        if(timeItem.options.items.selectCategorie){

            //Value Position Categorie
            zoneCategories.selectAll(".tickCategorie").each(function(value){
                if(value == d){

                    if(d3.select(this).attr("clicked") == "false"){ clicked = false; }
                    else if(d3.select(this).attr("clicked") == "true") { clicked = true;}
                    d3.select(this).attr("clicked", true);

                }
            })

            posCategorieInitial.forEach(function(values){
                if(values.id == d){
                    itemXpos = values.posx;
                    itemYpos = values.posy;
                }

            });

            if(clicked == false && countClicked == 1){

                noSorted = false;
                isClicked = true;

                //Transition Categories
                zoneCategories.selectAll(".tickCategorie").each(function(value){

                    positionCategories.push({
                        id:value,
                        posx:d3.transform(d3.select(this).attr("transform")).translate[0],
                        posy:d3.transform(d3.select(this).attr("transform")).translate[1]
                    });

                    if(value != d){

                        posZoneX = d3.transform(d3.select(this).attr("transform")).translate[0];
                        posZoneY = d3.transform(d3.select(this).attr("transform")).translate[1];

                        if(itemYpos < posZoneY) newPosY = itemYpos;
                        if(itemYpos > posZoneY) newPosY = itemYpos - heightLastCategorie;

                        d3.select(this)
                            //.transition().duration(800)
                            .transition()
                            .delay(delayTransition)
                            .attr("transform", "translate("+itemXpos+","+newPosY+")")
                            .style("visibility","hidden");

                    }else if(value == d){

                        d3.select(this)
                            //.transition().duration(800)
                            .transition()
                            .delay(delayTransition)
                            .attr("transform", "translate("+itemXpos+",0)");

                        var idRect = ".zoneCategorie"+d;
                        d3.select(this).select(idRect)
                            //.transition().duration(800)
                            .transition()
                            .attr("height", posYTimeline );

                        d3.select(this).select(".lineAxeYitems")
                            //.transition().duration(800)
                            .transition()
                            .attr("y1", posYTimeline )
                            .attr("y2", posYTimeline );

                        d3.select(this).select(".lineDivCate")
                            //.transition().duration(800)
                            .transition()
                            .delay(delayTransition)
                            .attr("x2", 0 );

                        d3.select(this).select(".textCategorie")
                            //.transition().duration(800)
                            .transition()
                            .delay(delayTransition)
                            .attr("y", posYTimeline/2 );

                    }
                });

                //Transition Items

                d3.selectAll(".item").each(function(value){

                    posZoneX = d3.select(this).attr("cx");
                    posZoneY = d3.select(this).attr("cy") + (heightLastCategorie/2);
                    var catItem = d3.select(this).attr("idCat");

                    positionItems.push({ id:value.idItem, posx: posZoneX, posy: d3.select(this).attr("cy") });

                    if(catItem != d){
                        if(posZoneY > itemYpos) newPosY = itemYpos + heightLastCategorie;
                        if(posZoneY < itemYpos) newPosY = itemYpos;

                        d3.select(this)
                            //.transition().duration(800)
                            .transition()
                            //.delay(delayTransition)
                            .attr("cx", posZoneX)
                            .attr("cy", newPosY)
                            .style("opacity",0)

                    }else if(catItem == d){

                        //randomPos = Math.floor((Math.random() * (posYTimeline - 50 )) + 50);
                        //timeItem.options.timeLine.posYTimeline
                        //sizeRadio
                        //Verify le random
                        randomPos = Math.floor((Math.random() * (timeItem.options.timeLine.posYTimeline - (sizeRadio * 2) )) + sizeRadio);
/*
                        valuesRandom.push({
                            id:value.idItem, posx: posZoneX, posy:randomPos
                        });

                        ctlRandom = searchByPosition(sizeRadio,posZoneX, randomPos, valuesRandom);
                        if(ctlRandom){
                            randomPos = Math.floor((Math.random() * (timeItem.options.timeLine.posYTimeline - (sizeRadio * 2) )) + sizeRadio);
                        }
*/
                        d3.select(this)
                            //.transition().duration(800)
                            .transition()
                            //.delay(delayTransition)
                            .attr("cx", posZoneX)
                            .attr("cy", randomPos);

                    }

                });

                countClicked = 0;

            }

            if(clicked == true && countClicked == 1){

                noSorted = true;
                isClicked = false;

                zoneCategories.selectAll(".tickCategorie").each(function(value) {
                    if (value == d) {
                        d3.select(this).attr("clicked", false);
                    }
                });

                //Transition Categories
                zoneCategories.selectAll(".tickCategorie").each(function(value){

                    var tickCategorie = this;
                    posCategorieInitial.forEach(function(posCategories){

                        if(posCategories.id == value){

                            d3.select(tickCategorie)
                                //.transition().duration(800)
                                //.transition()
                                //.delay(delayTransition)
                                .attr("transform", "translate("+posCategories.posx+","+posCategories.posy+")")
                                .style("visibility", "visible");

                            if(value == d){
                                var idRect = ".zoneCategorie"+d;

                                d3.select(tickCategorie).select(idRect)
                                    //.transition().duration(800)
                                    //.transition()
                                    //.delay(delayTransition)
                                    .attr("height", heightLastCategorie );

                                d3.select(tickCategorie).select(".textCategorie")
                                    //.transition().duration(800)
                                    //.transition()
                                    //.delay(delayTransition)
                                    .attr("y", heightLastCategorie/2 );

                                d3.select(tickCategorie).select(".lineDivCate")
                                    //.transition().duration(800)
                                    //.transition()
                                    //.delay(delayTransition)
                                    .attr("x2", (timeItem.options.graph.width - widhCategories) );

                                d3.select(tickCategorie).select(".lineAxeYitems")
                                    //.transition().duration(800)
                                    //.transition()
                                    //.delay(delayTransition)
                                    .attr("y1", heightLastCategorie )
                                    .attr("y2", heightLastCategorie );

                            }
                        }

                    });
                });

                //Transition Items

                d3.selectAll(".item")
                    //.transition().duration(800)
                    .transition()
                    //.delay(delayTransition)
                    .attr("cx", function(d){
                        return xpos = valuesX(new Date(d.dateItem));
                    } )
                    .attr("cy", function(d){
                        return ypos = valuesY(d.idCat) + (heightLastCategorie /2);
                    } )
                    .style("opacity",1);

                countClicked = 0;
            }

        }

    }

    function searchByPosition(size, posx, posy, myArray){

        var minX, maxX, minX, maxY;
        minx = posx - (size * 2);
        maxX = posx + (size * 2);

        minY = posy - (size * 2);
        maxY = posy + (size * 2);

        for (var i=0; i < myArray.length; i++) {
            if ( (myArray[i].posx >= minX && myArray[i].posx <= maxX) && (myArray[i].posy >= minY && myArray[i].posy <= maxY)  ) {
                return myArray[i];
            }
        }
    }

    function searchNameCategorie(d){
        var nameCategorie;
        dataItemsGraph.forEach(function(values){
            if(d == values.idCat ) nameCategorie = values.nameCat
        });
        return nameCategorie;
    }

    function savePositionInitial(){
        zoneCategories.selectAll(".tickCategorie").each(function(d, i) {
            categorieTransform = d3.transform(d3.select(this).attr("transform"))
            XtranslateCat = categorieTransform.translate[0];
            YtranslateCat = categorieTransform.translate[1];
            nameCat = searchNameCategorie(d);
            posCategorieInitial.push({ id: d, name:nameCat, posx:XtranslateCat, posy: YtranslateCat, order: i });
        });

        timeItem.zoneItem.selectAll(".dataItem").each(function(value){

            posItemsInitial.push({
                id:value.idItem,
                posx: d3.transform(d3.select(this).attr("transform")).translate[0],
                posy: d3.transform(d3.select(this).attr("transform")).translate[1]
            })

        });
    }

    window.timeItem = timeItem;

})();
timeItem.drawGraph();
