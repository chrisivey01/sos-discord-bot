const axios = require("axios")
const delay = ms => new Promise(resolve => setTimeout(resolve,ms))

module.exports = {

    updateLink: async (message, world, updateLinked) => {
        let url = `https://api.guildwars2.com/v2/wvw/matches/overview?world=${world}`

        await delay(2000)
        let result = await axios(url)

        let findLinkedObject = result.data.all_worlds

        let match =[];
        console.log(findLinkedObject)
        for(let color in findLinkedObject){
            let mainServerAndLink = findLinkedObject[color]

            if(mainServerAndLink.includes(world)) {
                match = mainServerAndLink
            }
        }

        match.forEach(w => {
            if(w !== world){
                updateLinked = w;
            }
        })
        console.log('SOS link server is ' + updateLinked)

        return updateLinked;

    }

}