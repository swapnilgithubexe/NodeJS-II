// Please do not change the prewritten code

import http from "http";
import fs from "fs";

const server = http.createServer((req, res) => {
  //  Write your code here
  if (req.method === "POST") {
    req.on("data", (chunk) => {
      fs.appendFileSync("data.txt", chunk)
    })
    req.on("end", () => {
      let txt = fs.readFileSync("data.txt", { encoding: "utf-8" })
      console.log(`Welcome to Coding Ninjas! Today's quote of the day is ${txt}`);
    })
    res.end("Data received")

  } else {
    res.end("Not Found")
  }


});

export default server;
