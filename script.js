
const fetchData='https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json';

function events(data){

    let eventsTable=document.getElementById('eventTable');

    for(let i = 0; i < data.length; i++) {
        let auxRow= document.createElement("tr");
        let element = data[i];
        if(data[i].squirrel){
            auxRow.classList.add('table-danger');
        }

        let auxNum = document.createElement('th');
        auxNum.setAttribute("scope", 'row');
        let auxText1 = document.createTextNode(`${i +1}`);
        auxNum.appendChild(auxText1);

        let auxEvents = document.createElement('td');
        let auxText2 = document.createTextNode(`${element.events}`);
        auxEvents.appendChild(auxText2);
        
        let auxSquirrel = document.createElement('td');
        let auxText3 = document.createTextNode(`${element.squirrel}`);
        auxSquirrel.appendChild(auxText3);

        auxRow.appendChild(auxNum);
        auxRow.appendChild(auxEvents);
        auxRow.appendChild(auxSquirrel);
        eventsTable.appendChild(auxRow);
    }
}


function MCC(data){
    let tn = data.values[0];
    let fn = data.values[1];
    let fp = data.values[2];
    let tp = data.values[3];
    let result = (((tp*tn)-(fp*fn))/ (Math.sqrt((tp+fp)*(tp+fn)*(tn+fp)*(tn+fn))));
    return{ event:data.event, result}
}


function correlation( data){
    let auxArray = [];
    
    data.forEach((entry) => {
        entry.events.forEach((event)=>{
            let findMatch = auxArray.find((element)=> element.event === event);
            if(!findMatch){
                let auxObj = {
                    event: event,
                    values: [0,0,0,0]
                }
                auxArray.push(auxObj);
            }
        });
        
    });
   
    data.forEach((entry)=>{
        let auxSquirrel =  entry.squirrel;

        auxArray.forEach((object)=>{
            if(!entry.events.find((element)=> element === object.event)){
                if(!auxSquirrel){
                    object.values[0]+=1
                }else{
                    object.values[2]+=1
                }
            }else{
                if(!auxSquirrel){
                    object.values[1]+=1
                }else{
                    object.values[3]+=1
                }
            }
        });
    });
   
    let auxCorrelation= auxArray.map(MCC).sort((aux1, aux2) => aux2.result - aux1.result);

    let correlationTable= document.getElementById('correlationTable');

    auxCorrelation.forEach((element, index)=>{
        let auxRow = document.createElement('tr');
        

        let auxNum = document.createElement('th');
        auxNum.setAttribute("scope", 'row');
        let auxText1 = document.createTextNode(`${index +1}`);
        auxNum.appendChild(auxText1);

        let auxEvents = document.createElement('td');
        let auxText2 = document.createTextNode(`${element.event}`);
        auxEvents.appendChild(auxText2);

        let auxCorrelation2 = document.createElement('td');
        let auxText3 = document.createTextNode(`${element.result}`);
        auxCorrelation2.appendChild(auxText3);

        auxRow.appendChild(auxNum);
        auxRow.appendChild(auxEvents);
        auxRow.appendChild(auxCorrelation2);
        correlationTable.appendChild(auxRow);
    });
}

    
    fetch(fetchData)
    .then((dataRaw)=>{
        
        return dataRaw.json();
    })
    .then((data)=>{
        
        events(data);
        correlation(data);
        
    });
