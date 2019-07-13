const axios = require("axios");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  register: async (message, database, client, updateLinked, world) => {
    const api = message.content.replace("!api ", "");
    if (message.channel.type !== "dm") {
      message.delete(message);
    }
    const url = `https://api.guildwars2.com/v2/account?access_token=${api}`;

    try {
      const response = await axios(url);
      await delay(1000);
      const sosData = {
        uid: message.author.id,
        api: api,
        world_id: response.data.world,
        account: response.data.name
      };
      const sql =
        "INSERT INTO sos_discord SET ? ON DUPLICATE KEY UPDATE api = VALUES(api), world_id = VALUES(world_id), account = VALUES(account)";

      database.query(sql, sosData, (err, result, field) => {
        if (err) {
          console.log(err);
        } else {
          message.channel.send(
            "You've been added to the Sea of Sorrows discord."
          );
          console.log("One user has registered.");
        }
      });

      //deals with adding user to verified role
      //obtain serverId
      const server = client.guilds.get("315306476212322315");
      const pendingUser = server.members.get(message.author.id);
      const verifiedRole = server.roles.find(
        role => role.name === "SoS Citizen"
      );
      const pairedRole = server.roles.find(role => role.name === "Paired");

      if (response.data.access[0] === "PlayForFree") {
        await message.channel.send(
          "You're a free player, buy the game with ya broke ass!"
        );
      } else if (
        response.data.world === world ||
        response.data.world === updateLinked
      ) {
        if (response.data.world === world) {
          await pendingUser.addRole(verifiedRole.id);
          await message.channel.send("You're now verified!");
        } else {
          await pendingUser.addRole(pairedRole.id);
          await message.channel.send("You're now verified/paired!");
        }
      } else {
        await message.channel.send(
          "Your account appears to not be on Sea of Sorrows or its link, or does not have a level 60+ character capable of entering WvW. Please confirm you can WvW on a character on FA or its link before reattempting to verify."
        );
      }
    } catch (err) {
      await client.guilds
        .get("315306476212322315")
        .channels.get("315553480418787329")
        .send(
          "User --> " +
            message.author.username +
            " is having issues registering. " +
            "This idiot is typing: \n" +
            err.response.config.url +
            "\nPlease assist this individual for all of our sanity."
        );

      await message.channel.send(
        "Issue reported! " + err.response.data.text + " Contacting moderators."
      );
    }
  }
};
