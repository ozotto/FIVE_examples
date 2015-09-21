/**
 * Created by Oscar on 11.09.15.
 */
var timeItemData;
var categories, items;

function getCategories() {
    var result = null;
    $.ajax({
        url: 'http://localhost/TMFive/RESTDataFive/categories',
        type: 'get',
        dataType: 'json',
        async: false,
        success: function(data) {
            result = data;
        }
    });
    return result;
}

function getItems() {
    var result = null;
    $.ajax({
        url: 'http://localhost/TMFive/RESTDataFive/dataItem',
        type: 'get',
        dataType: 'json',
        async: false,
        success: function(data) {
            result = data;
        }
    });
    return result;
}

categories = getCategories();
items = getItems();

function makeDataTimeItem(categories, items){
    var  timeItemData, listCategories = [], listItems = [], data, x;
    var numbersDate, date;
    var day, month, year;

    for(x=0; x<categories.length; x++){
        data = categories[x];
        if(data) {
            listCategories.push({"id": data.id, "name": data.name})
        }
    }

    for(x=0; x < items.length ; x++){
        data = items[x];
        if(data){

            numbersDate = data.date.match(/\d+/g);
            day = numbersDate[0];
            month = numbersDate[1];
            year = "20"+numbersDate[2];
            date = new Date(year, month, day);

            listItems.push({ "id": data.id, "title": data.name, "date":date, "categorie": data.idCat });
        }
    }

    timeItemData = {"categories": listCategories, "items": listItems};
    return timeItemData;
}

timeItemData = makeDataTimeItem(categories,items);
