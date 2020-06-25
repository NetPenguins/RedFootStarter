//Local Variables
let mymap //establish map element
let eventData //global tracking of user click(longpress/contextmenu) data
//initial entry point for onload
let data = [] //define data variable for local script only
let agreement = false;

// jquery call to get data from json file on server
// using build in try catch functions
function loadData(){
    $.getJSON(url).done(function(d){
        console.log("OK")
        data = d
    }).fail(function(err){
        alert(`Could not read json from ${url} with error ${err}`)
    })
}

//get user location 
function userLocation() {
    //check if geoloaction is enabled 
    if (window.navigator.geolocation) {
        //instantiate map at set coords before collecting user coords
        mymap = L.map('mapid').setView([35.22, -80.84], 13);
        window.navigator.geolocation.getCurrentPosition(successLocate, failedLocate);
    }else{
        mymap = L.map('mapid').setView([35.22, -80.84], 13);
        addLayer()
    }
}


/* Supporting Functions for map creation */
//able to get the user location successfully. 
const successLocate = position =>{
    //set the lat and long of the view and default zoom level to 13
    mymap.setView([position.coords.latitude, position.coords.longitude], 13);
    addLayer();
}

//failed to get location set default value (Charlotte NC)
function failedLocate(){
    addLayer();
}

//Establish the map tile layer using mapbox api and leaflet map
function addLayer(){
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    //attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    zIndex: 100,
    accessToken: 'pk.eyJ1IjoiY3dpbHMxOTIiLCJhIjoiY2p5Ym5ocTM4MDhubDNrb2NyNThjZjd6OCJ9.dlN48W8s4lnsCmLYCBhdTw'
}).addTo(mymap);
L.control.locate().addTo(mymap);//set user location button 
//Establish long press event .... This is long press on mobile and right click on computer
mymap.whenReady(onMapLoad)
}
//used to replace the longpress/rightclick event with toggle
function noThanks(){
    console.log('entered noThanks')
    toggleNeedCreds()
    mymap.off('contextmenu')
    mymap.on('contextmenu', toggleNeedCreds)
}

//used to establish the longpress/right click event
function createMapHandler(){
    try{
        if(mymap){
            mymap.off('contextmenu')
            mymap.on('contextmenu', longPressEvent)
        }
    }catch(err){
        console.log(err)
    }
}
/*
    When user navigates to Sightings.html we will first check if 
    they are logged in. If not we will present the credsModal informing
    them they must login to interact with and veiw the map. Upon succesfull 
    credential validation with their OAuth provider of choice we will 
    present them with a usage Modal seen below. 
*/
function toggleNeedCreds(){
    var cModal = document.getElementById("credsModal");
    cModal.classList.toggle("is-active");
    cModal.classList.toggle("is-hidden");
    $('html').toggleClass('is-clipped'); //ensure we scroll lock the background
}
//Event to handle long press 
function longPressEvent(e){
    eventData = e //set current event data
    //is this the first time we are opening the modal?
    if(!document.getElementById("PredList")){
        //console.log(data);
        var r = document.createElement("div")
        var s = document.createElement("div")
        var t = document.createElement("div")
        var sel = document.createElement("select")
        var button = document.createElement("button")
        button.className = "button is-primary"
        button.innerHTML = "Submit"
        r.className = "field"
        r.id = "PredList"
        s.className = "control"
        sel.id = "selection"
        t.className = "select is-medium"
        document.getElementById("Container").appendChild(r).appendChild(s).appendChild(t).appendChild(sel)
        r.appendChild(button)
        for (const val of data){
            var op = document.createElement("option")
            op.innerHTML = val.name
            op.value = JSON.stringify(val)
            sel.appendChild(op)
        }
        button.onclick = function () {
            choiceRecieved(JSON.parse($("#selection").val()))
        }
    }
    toggleModal();//show modal
}

//User made a choice
function choiceRecieved(choice){
    cir(eventData, choice) //pass control to creation of marker
    toggleModal()//close the modal as choice has been made
}

//function to create marker on map. 
//TODO: this may look better with a custom object overlay
function cir(e, choice){
    var coord = e.latlng;
    var lt = coord.lat;
    var lg = coord.lng;
    var today = new Date();
    var dataObject = {
        "name":choice.name,
        "coord":`${lt} , ${lg}`,
        "time":today.getTime(),
        "user":firebase.auth().currentUser.displayName,
        "img":choice.img,
        "des":choice.des,
        "id":(lt + lg).toString().replace('-', '').replace('.',''),
        //Future work will be to allow messaging, anonymous reporting, and confirm/deny 
        "anon":"",
        "msg":"",
        "confs":{"count":0,"user":firebase.auth().currentUser.displayName},
        "denies":{"count":0,"user":firebase.auth().currentUser.displayName}
    }
    writeUserData(dataObject)
    var circle = L.circle([lt, lg], {
        color: '#f03',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 100
    }).addTo(mymap);
    var popup = createPopup(dataObject);
    circle.bindPopup(popup);
    circle.on('contextmenu', null); //if user clicks on preexisting location ignore it.
}
//create the popup that will be displayed to the user when they click a marker on the map
function createPopup(pred){
    //create the actual card element
    var card = document.createElement("div");
    card.classList.add('card')
    var cardContent = document.createElement("div")
    cardContent.classList.add('card-content')
    //assign a header and content to the card-content section
    var media = document.createElement("div")
    media.className = "media"
    var align = document.createElement("div")
    align.className = "media-left"
    var fig = document.createElement("figure")
    fig.classList.add("image", "is-64x64")
    var image = document.createElement("img")
    image.src = pred.img;
    image.alt = pred.name;
    var medCont = document.createElement("div")
    medCont.className = "media-content"
    var title = document.createElement("p")
    title.classList.add('title', 'is-3', 'has-text-white-ter')
    var subtitle = document.createElement("p")
    subtitle.classList.add("subtitle", "is-6", 'has-text-grey-lighter')
    subtitle.innerHTML = `@${pred.user}`
    title.innerHTML = pred.name
    var content = document.createElement("p")
    content.classList.add('content')
    content.innerHTML = pred.des
    var foot = document.createElement("footer")
    foot.classList.add('cardFoot')
    foot.id = "cardFoot"
    var timestamp = document.createElement("div")
    timestamp.classList.add('timeStamp')
    var t = new Date(pred.time);
    timestamp.innerHTML = t
    foot.appendChild(timestamp)
    //EXPERIMENTAL
    // var conf = document.createElement("p")
    // conf.className = "card-footer-item"
    // var deny = document.createElement("p")
    // deny.className = "card-footer-item"
    // var cbutton = document.createElement("button")
    // var dbutton = document.createElement("button")
    // var tUp = document.createElement("i")
    // var tDown = document.createElement("i")
    // tUp.classList.add('fa', 'fa-thumbs-up')
    // tDown.classList.add('fa', 'fa-thumbs-down')
    // cbutton.classList.add('button', 'is-outlined', 'is-medium')
    // dbutton.classList.add('button', 'is-outlined', 'is-medium')
    // var countUp = document.createElement("p")
    // var countDown = document.createElement("p")
    // countUp.id = `${pred.id}Up`
    // countDown.id = `${pred.id}Down`
    // countUp.innerHTML = pred.confs.count === undefined ? "0" : pred.confs.count
    // countDown.innerHTML = pred.denies.count === undefined ? "0" : pred.denies.count
    // foot.appendChild(conf).appendChild(cbutton).appendChild(tUp)
    // cbutton.appendChild(countUp)
    // dbutton.appendChild(countDown)
    // foot.appendChild(deny).appendChild(dbutton).appendChild(tDown)
    // cbutton.onclick = function(){
    //     console.log("conf clicked")
    //     addConf(pred)
    // }
    // dbutton.onclick = function(){
    //     addDeny(pred)
    // }
    //assign the child elements to their parents to create the dom tree for this section
    card.appendChild(cardContent)
    cardContent.appendChild(media).appendChild(align).appendChild(fig).appendChild(image)
    media.appendChild(medCont).appendChild(title)
    medCont.appendChild(subtitle)
    card.appendChild(cardContent).appendChild(content)
    cardContent.appendChild(foot)
    return card;
}

//when the map loads we need to grab all preexisting data
function onMapLoad(){
    console.log("map loaded")
    fetchData()
    createMapHandler()
}

function userAgreement(val){
    agreement = val
}

function agreed(toggleWelcome){
    console.log("entered agreed")
    writeAgreement()
}
//EXPERIMENTAL
// function addConf(pred){
//     console.log(firebase.auth().currentUser.displayName)
//     console.log(pred.confs.user)
//     if(firebase.auth().currentUser.displayName !== pred.confs.user){
//         console.log(pred)
//         $(`#${pred.id}Up`).innerHTML = pred.confs.count++
//     }
// }

// function addDeny(pred){

// }
