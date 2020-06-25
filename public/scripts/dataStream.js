/*
    Firebase realtime database is being used to store the information regarding predators
    as they are marked on the map. The user must be signed in or the data will not
    be accessible due to rules set on the database. 
*/

//Function for writing data to firebase realtime data base
function writeUserData(dataObject) {
    firebase.database().ref('predators/' + dataObject.id).set({
        name: dataObject.name,
        id:dataObject.id,
        location: dataObject.coord,
        user: dataObject.user,
        time: dataObject.time,
        img:dataObject.img,
        des:dataObject.des,
        msg:dataObject.msg,
        anon:dataObject.anon,
        confs:dataObject.confs,
        denies:dataObject.denies
    }
)}
/*This function allows user to write to THEIR data ONLY firebase rules 
  are set to allow authoring of the users node only for the UID matching
  the currently logged in user. */
function writeAgreement(){
    //console.log(firebase.auth().currentUser)
    firebase.database().ref('users/' + firebase.auth().currentUser.uid).set({
        agreed: true
    })
}
//function for getting data from firebase 
function fetchData(){
    //console.log("fetching data from firebase")
    firebase.database().ref('predators/').on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot){
            createPopupRetrieved(childSnapshot.val())
        })
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

/*function to pass current users id to firebase 
   if the value has already been created for that user 
   we return true */
function fetchUserData(uid){
    //console.log("fetching user data")
    return new Promise(function(resolve, reject){
        firebase.database().ref(`users/${uid}`).once("value").then(function (snapshot){
            //no user found at uid 
            if(!snapshot.val()){
                return reject()
            }
            snapshot.forEach(function(child){
                userAgreement(child.val())
                return resolve()
            })
        })
    })
}
//create the popup needs to be establish in one place
function createPopupRetrieved(data){
    //TODO: add check if point already exists utilizing lat and lng for check. 
    var lt = data.location.split(",")[0]
    var lg = data.location.split(",")[1]
    var circle = L.circle([lt, lg], {
        color: '#f03',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 100
    }).addTo(mymap);
    var popup = createPopup(data);
    circle.on('contextmenu', null);
    circle.bindPopup(popup);
}

