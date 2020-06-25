/*Global functions*/
let url = 'https://apexalertengine.web.app/data/predData.json'
let url2 = 'https://apexalertengine.web.app/data/predNames.json'
//Create firebase config to hold the information for the application+domain to 
//verify itself to the backend
var firebaseConfig = {
    apiKey: "AIzaSyBnXj0CmCIAvbLlZFejIu7n7gFIuFghk80",
    authDomain: "apexalertengine.firebaseapp.com",
    databaseURL: "https://apexalertengine.firebaseio.com",
    projectId: "apexalertengine",
    storageBucket: "apexalertengine.appspot.com",
    messagingSenderId: "911972698521",
    appId: "1:911972698521:web:dc7a0d8f08a88c2f"
};
// Initialize Firebase
if(firebase.apps.length === 0){
    firebase.initializeApp(firebaseConfig);
}

