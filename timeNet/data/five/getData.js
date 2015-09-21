var timeNetData,timeNetOptions;
var names, nodes = [], link = [], i, z, x, numLinks, idTarget, data_date;
var source, target;

names = [
    'Gala Raver' ,
    'Gregorio Koelling',
    'Howard Mauricio',
    'Dagmar Lecompte',
    'Jammie Naff',
    'Althea Budniewski',
    'Rossana Flakes',
    'Ian Gilroy',
    'Delta Schulman',
    'Jude Mikelson',
    'Tiara Pichette',
    'Regena Varnadoe',
    'Rima Deleeuw',
    'Elda Howes',
    'Dahlia Gasser',
    'Waltraud Hillery',
    'Heath Hayse',
    'Matilde Camp',
    'Nathanial Schow',
    'Sarai Hukill',
    'Senaida Wanke',
    'Noella Gilland',
    'Lucrecia Polinsky',
    'Demetra Alberts',
    'Norris Earl',
    'Charlene London',
    'Taisha Catalan',
    'Chrystal Agin',
    'Stephnie Seligman',
    'Nannie Rota',
    'Carlyn Disney',
    'Hillary Moskowitz',
    'Deidre Genna',
    'Georgine Bachmann',
    'Jesusita Pellot',
    'Melva Biggins',
    'Un Greenhalgh',
    'Jayne Coffey',
    'Esmeralda Bozeman',
    'Kaycee Waldrup',
    'Brittny Pascua',
    'Cherrie Koepke',
    'Isaura Nicol',
    'Walker Alverez',
    'Jeffrey Kapinos',
    'Riva Walt',
    'Errol Mak',
    'Crysta Boelter',
    'Laquanda Boydston',
    'Julissa Fulton'
]

//for(i=0; i<names.length; i++){

for(i=0; i<names.length; i++){
    z=1;
    data_date = makeDate();

    nodes.push({
        id: i+1,
        date: data_date,
        title: names[i]
    });

    numLinks = Math.floor((Math.random() * 10) + 1);

    source = nodes[Math.floor(Math.random()*nodes.length)];
    target = nodes[Math.floor(Math.random()*nodes.length)];

    if(source.id == target.id){
        target = nodes[Math.floor(Math.random()*nodes.length)];
    }

    if(source.date >= target.date){
        data_date = new Date(new Date(source.date).setMonth(source.date.getMonth()+8));

    }else{
        data_date = new Date(new Date(target.date).setMonth(target.date.getMonth()+8));
    }

    link.push({
        id: i,
        source: source.id,
        target: target.id,
        date: data_date
    });
}


timeNetData = {
        nodes: nodes,
        links: link
        };

/*console.log(nodes);
console.log(link);
*/

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

function makeDate(){
    month = Math.floor((Math.random() * 10) + 1);
    day = Math.floor((Math.random() * 28) + 1);
    year = Math.floor((Math.random() * 3) + 1);

    if(year == 1) year = 2012;
    if(year == 2) year = 2013;
    if(year == 3) year = 2014;


    return new Date(year, month, day)
}
