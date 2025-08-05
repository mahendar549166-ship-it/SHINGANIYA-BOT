const fs = require("fs");
const path = __dirname + "/../commands/data/timeJoin.json";

module.exports.config = {
    name: "timejoin",
    eventType: ["log:unsubscribe"],
    version: "1.0.0",
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "User ke samuh se nikalne par uske pravesh samay ka data swatalit roop se hatao"
};

module.exports.run = async function ({ event: ghatna }) {
    const { threadID: samuhID, logMessageData: suchna } = ghatna;
    const { writeFileSync: likhna, readFileSync: padhna } = fs;
    const { stringify: saaransh, parse: vishleshan } = JSON;

    const vyaktiID = suchna.leftParticipantFbId;
    let data = vishleshan(padhna(path));
    delete data[vyaktiID + samuhID];
    likhna(path, saaransh(data, null, 2));
};
