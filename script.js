//client side
const serverUrl = "http://127.0.0.1:3000";

/// start function ///
document.addEventListener("DOMContentLoaded", function() {
    console.log("HTML DOM tree loaded, and ready for manipulation");
    //fetchData()
    const htmlBody = document.body;
    fetchArtist(85885);
    //getAllArtists();
})

/// functions for getting information from server ///
async function fetchArtist(artistID){  
    
    const response = await fetch(serverUrl + "/artist/" + artistID, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        body: null
    });

    if(response.ok){
        response.json().then((jsonBody) => {
            var singleArtistData = jsonBody;
            // send in data as parameter
            singleArtistPage(singleArtistData);
        })
    }
    else {
        console.log("error");
    }
}

async function getAllArtists(){
const response = await fetch(serverUrl + "/artists", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        body: null
    });

    if(response.ok){
        response.json().then((jsonBody) => {
            var allArtistData = jsonBody;
            // send in data as parameter
            listAllPage(allArtistData);

        })
    }
    else {
        console.log("error");
    }
}

/// functions for HTML dom tree manipulation
function singleArtistPage(singleArtistData){
    clearBody();

    const HTMLBod = document.body;
    const article = document.createElement("article");

    const artistTitle = document.createElement("h1");
    artistTitle.style.fontSize = "35px"
    artistTitle.innerText = singleArtistData.name;

    article.style.marginLeft = "20%";
    article.style.marginRight = "20%";
    
    const desc = document.createElement("p");
    desc.innerText = singleArtistData.description;

    const member = document.createElement("p");
    if (singleArtistData.realname != null){
        member.innerText = "Member(s): " + singleArtistData.realname;
    }
    member.style.fontSize = "large";
    member.style.fontWeight = "bold";
    member.style.fontStyle = "italic";

    const references = document.createElement("article");
    
    const refs = document.createElement("h1");
    refs.innerText = "References: ";
    references.appendChild(refs);
    
    console.log(singleArtistData.referenceUrls);

    const URL = document.createElement("p");

    for (let i = 0; i < singleArtistData.referenceUrls.length; i++){
        let daThing = document.createElement("p");
        daThing.innerHTML = "<a href =" + singleArtistData.referenceUrls[i] + ">" + singleArtistData.referenceUrls[i];
        URL.appendChild(daThing);
    }

    references.appendChild(URL);

    article.appendChild(artistTitle);
    article.appendChild(member)
    article.appendChild(desc);
    article.appendChild(references);


    HTMLBod.appendChild(menu());
    HTMLBod.appendChild(article);

}

function listAllPage(allArtistData){
    clearBody();
    const HTMLBod = document.body;

    const Title = document.createElement("h2");
    const allArtistBoxes = document.createElement("div");

    Title.innerText = "Artist Database Page"
    title(Title);


    for (let i = 0; i < allArtistData.length; i++){
        const anArtist = document.createElement("div");
        anArtist.innerText = allArtistData[i].name;
        artistBox(anArtist);
        allArtistBoxes.appendChild(anArtist);
        
        // click to get to thingy
        anArtist.addEventListener("click", function() {
            fetchArtist(allArtistData[i]._id);
        });
        // make a reference to the artist page ???
    }

    allArtistBoxes.style.display = "flex";
    allArtistBoxes.style.flexWrap = "wrap";
    allArtistBoxes.style.justifyContent= "center";

    
    HTMLBod.appendChild(Title);
    HTMLBod.appendChild(allArtistBoxes);
    
}

/// smaller functions ///

function artistBox(theDiv){
    theDiv.style.margin="10px";
    theDiv.style.marginLeft="1%";
    theDiv.style.marginRight="1%"; 
    
    theDiv.style.cursor = "pointer";

    theDiv.style.padding="5px"
    theDiv.style.paddingTop="2%"
    
    theDiv.style.border = "5px solid #8c70cf"
    theDiv.style.borderRadius = "25px"

    theDiv.style.fontFamily = "sans-serif";
    theDiv.style.fontSize = "25px";
    theDiv.style.textAlign = "center";

    // Fix later???
    // theDiv.style.display = "inlineBlock"

    // text fonts n shit

    theDiv.style.minHeight = "180px";
    theDiv.style.maxHeight = "180px";
    theDiv.style.minWidth = "250px";
    theDiv.style.maxWidth = "250px";

}

function clearBody(){
    document.body.innerHTML = "";
}

function menu(){
    const Menu = document.createElement("article");
    const daDiv = document.createElement("h2");
    
    daDiv.innerText = "Back to Main Menu"
    daDiv.style.cursor = "pointer";

    title(daDiv);

    daDiv.addEventListener("click", function() {
        getAllArtists()
    });
    Menu.appendChild(daDiv);

    return Menu;
}

function title(Title){

    Title.style.border = "5px solid";
    Title.style.fontFamily = "sans-serif";
    Title.style.fontVariant = "small-caps";
    Title.style.borderColor = "#8c70cf"; // change l8r
    Title.style.margin = "auto";
    Title.style.width = "50%";
    Title.style.padding = "10px";
}