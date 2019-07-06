const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  messageRanksAndRemoveRoles: (message, client) => {
    const server = client.guilds.get("315306476212322315");
    let serverRoleId = obtainVerifiedRank(server);

    messageVerified(message, server, serverRoleId, client);
  }
};

//obtains server ID of the rank you want to message
obtainVerifiedRank = server => {
  const verifiedRank = server.roles.find(x => x.name === "SoS Citizen");

  return verifiedRank.id;
};

async function messageVerified(message, server, serverRoleId, client) {
  let memIterator = 0;
  for (let mem of server.members) {
    try {
      if (await mem[1]._roles.includes(serverRoleId)) {
        console.log(memIterator++ + "member has been unverified and messaged");
        await delay(1000);
        await mem[1].removeRole(serverRoleId);
        await client.users
          .get(mem[1].user.id)
          .send(
            "All SoS users please re-verify! Type -> !api APICODEHERE \nAny issues? Message Moderators."
          );
      }
    } catch (err) {
      console.log(err);
    }
  }
}
