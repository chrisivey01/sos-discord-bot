const axios = require("axios");
let gw2Api = "https://api.guildwars2.com/v2/account?access_token=";
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  scan: async (message, client, pool, linkId, world) => {
    const queryDb = "SELECT * From sos_discord";
    const results = await pool.query(queryDb);

    //find server
    const server = client.guilds.get("315306476212322315");
    //define role to give
    const verified = server.roles.find(x => x.name === "SoS Citizen");
    const paired = server.roles.find(x => x.name === "Paired");

    // let iterator = 0;
    let v = 0;
    let un = 0;

    for await (const res of results) {
      await delay(2000);

      let playerFound = server.members.find(x => x.id === res.uid);
      let gw2Info;
      try {
        gw2Info = await axios.get(gw2Api + res.api);
        if (playerFound !== null) {

          if (gw2Info.data.world === world) {
            await playerFound.addRole(verified);
            console.log("Verified " + v++);
          } else {
            await playerFound.removeRole(verified);
            console.log("Unverified " + un++);
          }

          if (gw2Info.data.world === linkId) {
            await playerFound.addRole(paired);
            console.log("Paired " + v++);
          } else {
            await playerFound.removeRole(paired);
            console.log("Not Paired " + un++);
          }
        }
      } catch (err) {
        if (playerFound) {
          console.log(
            `${res.uid} this Discord UID has invalid API removing their role.`
          );
        } else {
          console.log(
            `${res.uid} this Discord UID is no longer on the server.`
          );
        }
      }
    }
  }
};
