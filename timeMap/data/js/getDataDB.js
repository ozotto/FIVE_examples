/**
 * Created by Oscar on 11.09.15.
 */

var timeMapData, itemsMap;

timeMapData = [
    {   "id": 1, "name": "Bulle", date: new Date(2014, 1, 10), "coordinates": [7.063768, 46.613474] },
    {   "id": 2, "name": "Romont", date: new Date(2014, 4, 5), "coordinates": [6.914822, 46.691155] }
];



function getItemsMap() {
    var result = null;
    $.ajax({
        //http://52.24.52.190/RESTDataFive/index.php/dataMap
        url: 'http://localhost/TMFive/RESTDataFive/dataMap',
        type: 'get',
        dataType: 'json',
        async: false,
        success: function(data) {
            result = data;
        }
    });
    return result;
}

itemsMap = getItemsMap();

timeMapData = makeDataTimeMap(itemsMap);


function makeDataTimeMap(items){
    var listItemsMap = [], data, x;
    var numbersDate1, date1, numbersDate2, date2;
    var day, month, year;

    for(x=0; x < items.length ; x++){
        data = items[x];

        if(data){

            numbersDate1 = data.dateIni.match(/\d+/g);
            day = numbersDate1[0];
            month = numbersDate1[1];
            year = "20"+numbersDate1[2];
            date1 = new Date(year, month, day);

            numbersDate2 = data.dataFin.match(/\d+/g);
            day = numbersDate2[0];
            month = numbersDate2[1];
            year = "20"+numbersDate2[2];
            date2 = new Date(year, month, day);

            listItemsMap.push({ "id": data.id, "name": data.title, "date":date1, "coordinates": [data.longitude, data.latitude] });
        }
    }

    return listItemsMap;
}
