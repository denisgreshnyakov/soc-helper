const path = require("path");
const express = require("express");
const cors = require("cors");

const config = require("./config/config");

const app = express();

app
  .use(cors())
  .use(
    express.static(path.join(__dirname, "../client"), config.staticSiteOptions)
  );

require("./routes/routes")(app);

app.listen(config.port, config.ip, () => {
  console.log(`SOC-Helper ${config.version} начал работу`);
});
