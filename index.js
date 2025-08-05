const { spawn } = require("child_process");
const express = require("express");
const path = require("path");
const logger = require(process.cwd() + "/utils/log.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve index.html on the root path
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start the Express server
app.listen(PORT, () => {
    logger(`Server is running on http://localhost:${PORT}`, "[ SERVER ]");
});

// Bot start logic
function startBot(message) {
    if (message) logger(message, "[ STARTING ]");

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "SHANKAR.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (codeExit) => {
        if (codeExit !== 0 || (global.countRestart && global.countRestart < 5)) {
            global.countRestart = (global.countRestart || 0) + 1;
            startBot("Restarting bot...");
        }
    });

    child.on("error", function(error) {
        logger("An error occurred: " + JSON.stringify(error), "[ STARTING ]");
    });
}

startBot();
