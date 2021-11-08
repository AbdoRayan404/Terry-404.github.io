//########################//
//www.github.com/Terry-404//
//########################//
//  Version: 0.1 JS-only  //
//########################//

    var category = ""
    var player = { //player object (holds everything, balance, inventory, maybe name...)
        name: "HaQer",
        balance: 0,
        inventory: {
            //itemID in inventory (Key) : itemName
            1: "Newbie Gift: Paralyze Knife"
        },
    };
    const marketItems = { //object for the whole market (Key "category" : [ 2 dimeonsional array "itemName & price"])
        //category name (Key) : 2 dimonsional array
        "weapons": {
            0: {
                name : "Long Sword",
                price : 30,
                type : "sword",
                atk : 3,
                rarity : "common"
            },

            1: {
                name : "Fighting Gloves",
                price : 10,
                type : "grip",
                atk : 1,
                rarity : "common"
            },

            2: {
                name : "Kimono Armor",
                price : 60,
                type : "armor",
                def : 4,
                rarity : "common"
            }
        },

        "nationalTreasures": { //national Treasures Category Object
            0: {
                name : "Bongseon",
                price : 1000000000,
                type : "sword",
                atk : 69000,
                rarity : "unique"
            },

            1: {
                name : "Holy Grail",
                price : 100000,
                type : "Chalice",
                atk : 0,
                rarity : "Copy"
            }
        },

        "godPower": { //God power Category Object
            0: {
                name : "Prince of Natak: Ardun",
                price : 20000,
                type : "princes",
                souls : 1,
                rarity : "Rare"
            },

            1: {
                name : "Prince of Natak: Lot",
                price : 20000,
                type : "princes",
                souls : 1,
                rarity : "Rare"
            }
        }
    }

    function marketUpdater() {
        category = document.getElementById("category").value //takes the category that player choose
        let marketList = document.getElementById("marketList")
        marketList.innerText = "" //clear it to prevent Stacking
        let itemsAvaliable = Object.keys(marketItems[category]).length - 1 //see how many items marketItems object have in it's category !

        for (let i = 0; i <= itemsAvaliable; i++) { // create new tags (li, p, button) give them attributes and text and append them to MarketList
            let newLi = document.createElement("LI") //for the item name
            let itemData = document.createElement("P") // for the item price,Type,Attribute,
            let newButton = document.createElement("BUTTON") //Button ...
            itemData.setAttribute("id", `mi${i}Data`)
            
            let newLiContent = document.createTextNode(`${marketItems[category][i].name}`)
            let newButtonContent = document.createTextNode("Buy")

            newLi.appendChild(newLiContent)
            newButton.appendChild(newButtonContent)

            newLi.setAttribute("id", `marketItem${i}`)
            newButton.setAttribute("onclick", `marketBuy(${i})`) //send to marketBuy function the itemID when clicked

            let statType //var for statType in the item
            let statValue //for statValue in the item
            if(marketItems[category][i].hasOwnProperty("atk")){ //check if the item have atk or def or souls then add which one the item have
                statType = "Atk"
                statValue = marketItems[category][i].atk
            } else if(marketItems[category][i].hasOwnProperty("def")){
                statType = "Def"
                statValue = marketItems[category][i].def
            } else if(marketItems[category][i].hasOwnProperty("souls")){
                statType = "Souls"
                statValue = marketItems[category][i].souls
            }      
            
            //adding all the new elements to the marketList element
            marketList.appendChild(newLi) //put the elements in marketList <ul> in order (itemName -> itemData -> button for buying)
            marketList.appendChild(itemData)
            marketList.appendChild(newButton)
            document.getElementById(`mi${i}Data`).innerHTML = `Price:${marketItems[category][i].price}<br>Type:${marketItems[category][i].type}<br>${statType}:${statValue}<br>Rarity:${marketItems[category][i].rarity}`
            document.getElementById(`marketItem${i}`).style.fontWeight = "bold" // make the item <Li> bold
        }
    }

    function marketBuy(itemNum) {
        let playerBalance = player.balance
        let price = marketItems[category][itemNum].price //get the price from the marketItems object (1 is the price array)

        if (playerBalance >= price) {

            inventoryAdd(marketItems[category][itemNum].name)
            inventoryUpdate()
            editGold(price, "remove")

            if (category == "weapons") { //saves your inventory in the cookies
                cookiesSave("inventory", `,W${itemNum}`) 
            } 
            else if (category == "nationalTreasures") {
                cookiesSave("inventory", `,N${itemNum}`)
            } 
            else if (category == "godPower") {
                cookiesSave("inventory", `,G${itemNum}`)
            }
        }
    }


    function inventoryAdd(item){
        let nextKey = Object.keys(player.inventory) //get keys in inventory Object in array
        nextKey = nextKey.length + 1 //gets the last key then add 1 on it

        player.inventory[nextKey] = item; //add  the item to player inventory Object with new key (ID)
    }

    function inventoryRemove(){
        //nothing yet...
    }

    function inventoryUpdate(){
        let inventoryHTML = document.getElementById("inventory")
        inventoryHTML.innerText = "" //clears all tags inside it so it doesn't stack up
        let playerInventoryArray = []

        let keysLength = Object.keys(player.inventory)
        keysLength = keysLength.length //gets how many keys (items/IDs) does the player inventory object have

        for (let i = 1; i <= keysLength; i++) { //takes all items from player inventory Object and put it in the array
            playerInventoryArray.push(player.inventory[i])
        }

        for (let i = 0; i <= playerInventoryArray.length - 1; i++) { //create new <li> and then add itemsName inside it
            let newLi = document.createElement("LI")
            let newContent = document.createTextNode(playerInventoryArray[i])
            newLi.appendChild(newContent)


            inventoryHTML.appendChild(newLi) //apped it into the inventory HTML as child
        }
    }

    function editGold(num = 1, process = "add") { //if the function got called without any paramters it will add 1 gold (default params)
        //false is - , true is +
        if (process == "add") {
            player.balance = player.balance + num
        } else if (process == "remove") {
            player.balance = player.balance - num
        } else if (process == "set") {
            player.balance = num
        }

        updateManager("gold") //update the gold on html after it's done
        cookiesSave("balance", player.balance) //save the gold to the cookies
    }

    function updateManager(process = "all") { //updates gold/Name/cookies or all on HTML
        if (process == "all") {
            let playerBalance = player.balance
            let playerName = player.name

            document.getElementById("name").innerText = `Hello ${playerName}, Welcome to G.O.H game`
            document.getElementById("balance").innerText = `Balance:${playerBalance}`

            inventoryUpdate() 
        } else if (process == "gold") {
            let playerBalance = player.balance

            document.getElementById("balance").innerText = `Balance:${playerBalance}`
        }

    }

    function cookiesSave(name, value) {
        if (name == "balance" || name == "name") {
            document.cookie = `${name}=${value}`
        } else if (name == "inventory") {
            let oldCookie = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)') ?.pop() || ''
            let newCookie = value
            newCookie = oldCookie.concat(newCookie)

            document.cookie = `${name}=${newCookie}` //set the concated cookie to the cookies
        }
    }

    function cookiesGet(name){
        return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)') ?.pop() || ''
    }

    function cookiesLoader() {
        let inventoryCookie = document.cookie.match('(^|;)\\s*' + "inventory" + '\\s*=\\s*([^;]+)') ?.pop() || ''  //i have no idea how this work "i yoinked it" but it gives cookies values that u looking for
        let balanceCookie = document.cookie.match('(^|;)\\s*' + "balance" + '\\s*=\\s*([^;]+)') ?.pop() || ''
        let nameCookie = document.cookie.match('(^|;)\\s*' + "name" + '\\s*=\\s*([^;]+)') ?.pop() || ''
        
        if (inventoryCookie && balanceCookie && nameCookie ) { //if all cookies exist then...

            inventoryCookie = inventoryCookie.split(",") //split the inventoryCookie with ","

            for (let j = 0; j < inventoryCookie.length; j++) {

                if (inventoryCookie[j].match(/W[0-9*]/g) != undefined) { //check if the split is for specific Category then
                    inventoryAdd(marketItems["weapons"][inventoryCookie[j].replace("W", "")].name) // send to inventoryManager to add it to the
                } 
                else if (inventoryCookie[j].match(/N[0-9*]/g) != undefined) {
                    inventoryAdd(marketItems["nationalTreasures"][inventoryCookie[j].replace("N", "")].name)
                } 
                else if (inventoryCookie[j].match(/G[0-9*]/g) != undefined) {
                    inventoryAdd(marketItems["godPower"][inventoryCookie[j].replace("G", "")].name)
                }

            }

            player.name = nameCookie
            editGold(parseInt(balanceCookie), "set") //set player gold to the gold retrieved from the cookie
            updateManager("all") //update all after it's done

        } else { //if there is no cookies then it's first time visiting then give Cookies !
            document.cookie = "balance=25"
            document.cookie = "inventory=W0"
            document.cookie = "name=Guest"
            cookiesLoader()
        }
    }

    function redirect(param = ""){
        if (param == ""){ //if it's called without sending any params then it's the button
            let nameInput = document.getElementById("nameInput").value //gets the input player put for the new name
        
            if(nameInput != ""){ //it must have input
                let currentUrl = window.location.href
                window.location.href = `${currentUrl}?name=${nameInput}`
            }
        }else { //if it's called with param then it's function calling from another function or terminal
            window.location.href = param //so just redirect as the param sent
        }
        


    }

    function urlSearch(){ //search for the ?name= paramter
        let currentUrl = window.location.href
        let chosenName
        const regexPattren = /\?name=/;

        if(regexPattren.test(currentUrl) == true){
            currentUrl = currentUrl.split("?name=") //splits the url example: www.goh.com?name=Value
            chosenName = currentUrl[1] // [0] == www.goh.com , [1] == Value
        }else{
            return
        }

        cookiesSave("name", chosenName)
        redirect(currentUrl[0])
    }

    document.body.onload = cookiesLoader() //when whole page load "load" cookies
    urlSearch() //check if the url is being sent with paramter
    