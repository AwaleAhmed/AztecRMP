let listProfs = []
let professers
let count = 0
let secRows = document.getElementById("sectionRowTitles") //from SDSU Webportal 

let ratingColumn = document.createElement("div")
ratingColumn.innerHTML = "Rating"
ratingColumn.className = "ratings column"
secRows.appendChild(ratingColumn)
professers = document.getElementsByClassName("sectionFieldInstructor")

let secMeetings = document.getElementsByClassName("sectionMeeting")
let splitnames = []

function main() {
    for (let i = 0; i < secMeetings.length; i++) {
        let rating = document.createElement("div")
        rating.className = "ratings position" //create rating spot for every section meeting 
        secMeetings[i].appendChild(rating)
        let link = document.createElement("div")
        link.className = "link column"
        secMeetings[i].appendChild(link)

        if (professers[i + 1].innerHTML == undefined) {
            return;
        }
        let slicedName = professers[i + 1].innerHTML.slice(0, -1) //cut off unneeded char at end
        if (slicedName.localeCompare("") != 0) {
            listProfs.push(slicedName)
            let extract = slicedName.match(/>(.*?)</).pop().split(" "); //extract name from HTML
            splitnames.push(extract) //2d array where first name is at index 0 and last at index 1
            let searchURL = "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=San+Diego+State+University&queryoption=HEADER&query=" + splitnames[i][1] + "&facetSearch=true"; //url not formatted correctly
            chrome.runtime.sendMessage({
                url: searchURL
            }, function (responseText) {
                findRating(responseText, splitnames)
            });




        }
    }
}

function findRating(response, splitnames) { //get the link to prof RMP
    let RMPLink
    let rmpFirstName
    let initial
    let lastname
    let rmpLastName
    let div = document.createElement("div")
    div.innerHTML = response
    let id = div.getElementsByClassName("listing PROFESSOR")

    for (let i = 0; i < splitnames.length; i++) {
        initial = splitnames[i][0].substring(0, 1)
        lastname = splitnames[i][1].toUpperCase()
        let name = div.getElementsByClassName("main")[0].innerHTML
        rmpLastName = name.split(",")[0].toUpperCase()

        rmpFirstName = name.split(",")[1].charAt(1) //initial 
        if (lastname.localeCompare(rmpLastName) == 0 && initial.localeCompare(rmpFirstName) == 0) {
            let fullLink = document.createElement("div")
            fullLink.innerHTML = id[0].innerHTML 
            let aTag = fullLink.getElementsByTagName("a")
            RMPLink = 'http://www.ratemyprofessors.com/' + aTag[0].href.slice(25) //link is directly to professors page, instead of search page like before
            chrome.runtime.sendMessage({
                url: RMPLink
            }, function (responseText, RMPLink) {
                addRating(responseText, RMPLink)
            })
        }
    }

}


function addRating(responseText, RMPLink) {  //add rating into webportal
    let page = document.createElement("div")
    page.innerHTML = responseText;
    let gradeSearch = page.getElementsByClassName("grade")
    let grade = gradeSearch[0].innerHTML
    let scale = "/5"
    let rmpFirstName = page.getElementsByClassName("pfname")
    let rmpInitial = rmpFirstName[0].innerHTML.charAt(1) 
    let rmpLastName = page.getElementsByClassName("plname")[0].innerHTML.slice(19).toUpperCase()
    rmpLastName = rmpLastName.substring(0, rmpLastName.length - 17)


    for (i = 0; i < secMeetings.length; i++) {
        let instructor = secMeetings[i].getElementsByClassName("sectionFieldInstructor")
        let instructorname = instructor[0].innerText.slice(0, -1)
        let str = instructorname.split(" ")
        let webportalfirst = str[0].charAt(0)
        let webportallast = str[1].toUpperCase()

        if (rmpInitial.localeCompare(webportalfirst) == 0 && rmpLastName.localeCompare(webportallast) == 0) {
            secMeetings[i].getElementsByClassName("ratings position")[0].innerHTML = grade.concat(scale)
        }
    }


}

main()