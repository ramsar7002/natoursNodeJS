const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

//Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running on port ${port}...`);
});
