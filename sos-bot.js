const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./auth.json");

//handles registration of users
const registerUsers = require("./components/register-users.js");
const checkUsersServers = require("./components/check-users-servers.js");
const messageAllUsers = require("./components/message-all-users.js");
const updateServerLink = require("./components/update-server-link.js");

//db
const database = require("./components/database.js");

const world = 1016;
let link;
let message;

//Cron Jobs
const CronJob = require("cron").CronJob;
new CronJob(
  "0 */5 * * * *",
  async () => {
    link = await updateServerLink.updateLink(message, world, link, delay);
    console.log("You will see this message every 5 minutes");
  },
  null,
  true,
  "America/Chicago"
);

new CronJob(
  "0 0 */12 * * *",
  async () => {
    await checkUsersServers.scan(message, client, pool, link, world);
    console.log("You will see this message every 12 hours");
  },
  null,
  true,
  "America/Chicago"
);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

client.login(config.token);

client.on("ready", () => {
  console.log("We are onine");
});

client.on("guildMemberAdd", member => {
  member.user.send(
    "This is the SOS discord." +
      "If you're having any issues please message a moderator in discord" +
      "\n\n\n" +
      "Welcome to Sea Of Sorrows! To gain full access to all voice and text channels, you will need to verify. Type the following, replacing the #### string with your own API key. \n" +
      "!api #######-####-####-####-####################-####-####-####-############ \n" +
      "To access or generate API keys, please visit <https://account.arena.net/applications> and generate a key with the account flag. \n" +
      "Please do not delete the API key used to verify, or you will be unverified as the bot will have no key to reference."
  );
});

client.on("message", async message => {
  if (message.content.match("!hi")) {
    message.channel.send("Chris is a shithead");
  }

  if (message.content.startsWith("!api")) {
    registerUsers.register(message, database, client, link, world);
  }

  if (message.content.match("!updateLink")){
    updateServerLink.updateLink(message, world, link, delay);
  }

  // if (message.content.match("!messageUsers")) {
  //   messageAllUsers.messageRanksAndRemoveRoles(message, client);
  // }

  if (message.content.match("!forceScan")) {
    checkUsersServers.scan(message, client, database, link, world);
  }
});
