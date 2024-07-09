const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvent = async (msg, filename) => {
  const dateNow = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const uniqueID = uuid();

  const logItem = `${uniqueID}\t${dateNow}\t${msg}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "logs")))
      await fsPromises.mkdir(path.join(__dirname, "logs"));

    await fsPromises.appendFile(
      path.join(__dirname, "logs", filename),
      logItem,
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = logEvent;
