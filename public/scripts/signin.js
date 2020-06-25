//only using GoogleAuthProvider for UNCC project will allow more later
var provider = new firebase.auth.GoogleAuthProvider();

//handler for when a user is logged in or out
$("#header").ready(function(){
    firebase.auth().onAuthStateChanged(function(user){
        //window.user = user;
        if(user){
            checkSigninLength()
            //console.log(user)//for testing
            setImage(user)
            changeToSignedin()
        }else{
            console.log("no user found")
            setImage(null)
        }
        if(document.URL.includes("sightings.html")){
            if(document.getElementById("credsModal").classList.contains("is-active")){
                toggleNeedCreds()
            }
            //check if user exits 
            if(user){
                //set promise here to wait for value return
                fetchUserData(user.uid).then(function(){
                    //console.log(`agreement = ${agreement}`)
                    if(agreement === false){
                        toggleMessage()
                    }
                }).catch(err => {
                    console.log(`caught ${err}`)
                    toggleMessage()
                }).then(() => {
                    if(!mymap){
                        loadData()
                    }
                }).then(() => {
                    if(!mymap){
                        userLocation()
                    }
                }).then(createMapHandler()).catch(err =>{
                    console.log(`caught err: ${err}`)
                })
            }else{
                console.log("toggleNeedCreds")
                if(!mymap){
                    loadData()
                    userLocation()
                }
                toggleNeedCreds()
            }
        }
    })
})

//method that is called when user wishes to sign in 
//returns promise 
function signin(){
    new Promise (function(resolve, reject){
        firebase.auth().signInWithPopup(provider).then(function(result) {
        // Google access token is needed to interact with the map. If a user is not logged in they
        // will not be allowed to report a new point on the map. Current firebase rules are set to 
        // accept only uncc.edu domain accounts. This will change when moved to portfolio hosting 
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        setImage(user)
        changeToSignedin()
        return resolve()
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
            console.log(`Message: ${errorMessage} \n crendentialtype: ${credential} \n errorCode: ${errorCode}`)
            return reject()
        })
    })
}       

//method to call when user signs out
function signOut(){
    //signout the user and reload the page 
    firebase.auth().signOut();
    location.reload()
}

//set the image element in the nav bar to the user's account image
function setImage(user){
    //if there is no user leave the element empty
    try{
        if(!user.displayName){
            null
        }
    }catch{
        return
    }
    //check if icon already exists if so do nothing
    try{
        if(document.querySelector("#userIcon").hasChildNodes()){
            return
        }
    }catch(err){
        console.log(err.message)
        if(!err instanceof TypeError && err.message.includes('userIcon'))
            throw err;
    }
    //console.log(`user photo = ${user.photoURL}`)
    var uI = document.querySelector("#userIcon")
    if(!uI){
        uI = document.createElement("figure")
        uI.id = "userIcon"
        uI.classList.add("image", "is-48x48")
    }
    var newI = document.createElement("img")
    newI.src = user.photoURL
    newI.alt = name.displayName
    newI.className = "is-rounded"
    uI.appendChild(newI)
}

//change element for sign in 
function changeToSignedin(){
    try{
        var curEl = document.getElementById("signedin")
        curEl.innerText = "Sign Out"
        curEl.id = "signout"
        curEl.onclick = function(){signOut()}
    }catch(err){
        if(!err instanceof TypeError && err.message.includes('signedin'))
            throw err;
    }
}

//change element for signout
function changeToSignedOut(){
    var curEl = document.getElementById("signout")
    curEl.innerText = "Sign In"
    curEl.id = "signedin"
    curEl.onclick = function(){signin()}
}
//check how long the user has been signed in if greater that 24 hours log them out.
function checkSigninLength(){
    var yesterday = new Date().getTime() - (24 * 60 * 60 * 1000);
    //console.log(`yesterday = ${yesterday} \n creationTime = ${firebase.auth().currentUser.metadata.a}`)
    if(firebase.auth().currentUser.metadata.lastSignInDate < yesterday){
        alert("Security Logout. Please signin again.")
        signOut();
    }
}