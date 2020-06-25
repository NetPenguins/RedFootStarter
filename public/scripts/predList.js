$("#header").ready(function(){
    loadNames() 
})
//AJAX call to file on server housing names of all predators.
//This file contains the names of predators and makes it easy to add and remove them on the fly.
function loadNames(){
    $.ajax({
        type:'GET',
        url: url2,
        async: true,
        dataType: 'json',
        success: function(data){
            loadDat(data)
        },
        fail: function(err){
            alert(`Could not read json from ${url} with error ${err}`)
        }
    })
}
//function for handling the data object as a whole
function loadDat(dat){
    for(var d of dat){
        //console.log(d.name)
        wikiLoad(d.name)
    }
}
//AJAX call to wikipedia api 
//we will pass in the name of the animal we want data on
//we will get the image url along with name and 3 scentence description and create element from here.
//url query constructed using the api sandbox at https://en.wikipedia.org/wiki/Special:ApiSandbox
function wikiLoad(name){
    $.ajax({
        type:'GET',
        url: `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts%7Cpageimages&titles=${name}&exsentences=3&explaintext=1&pithumbsize=200`,
        async: true,
        dataType: 'jsonp',
        success: function(data){
            for(var d in data.query.pages){
                var da = {
                    "link":`https://en.wikipedia.org/?curid=${data.query.pages[d].pageid}`,
                    "img":data.query.pages[d].thumbnail.source,
                    "name":data.query.pages[d].title,
                    "des":data.query.pages[d].extract
                }
                createElements(da)
            }
        },
        fail: function(err){
            alert(`Could not read json from ${url} with error ${err}`)
        }
    })
}

function createElements(d){
    //iterate over data and createCard per value
    if(!d){ //is d falsy?
        console.log("Could not parse data");
        alert('Something went wrong'); //create better looking message in body (html)
        return
    }
    console.log(`Creating object for ${d.name} . . . .`)
    createCard(d)
}

/*
Dynamically create predator information cards based on predData.json 
After obtaining the data from predData.json we will create identical 
card elements using the information provided by wikipedia. 
*/
function createCard(d){
    //create card container which will be a link so no matter where in the object
    //the user clicks it will navigate to the associated page 
    var link = document.createElement("a"); 
    var space = document.createElement("br")
    document.getElementById("Container").appendChild(link);
    document.getElementById("Container").appendChild(space);
    link.href = d.link;
    link.target = "_blank"
    //create the actual card element
    var card = document.createElement("div");
    card.classList.add('card')
    //create the card image with alt set to name
    var cardImage = document.createElement("div")
    cardImage.classList.add('card-image')
    var image = document.createElement("img")
    image.src = d.img;
    image.alt = d.name;
    //create the card content 
    var cardContent = document.createElement("div")
    cardContent.classList.add('card-content')
    //assign a header and content to the card-content section
    var title = document.createElement("h4")
    title.classList.add('title', 'is-3')
    title.innerHTML = d.name
    var content = document.createElement("p")
    content.classList.add('content')
    content.innerHTML = d.des
    content.classList.
    //assign the child elements to their parents to create the dom tree for this section
    link.appendChild(card).appendChild(cardImage).appendChild(image)
    card.appendChild(cardContent).appendChild(title)
    card.appendChild(cardContent).appendChild(content)
}
