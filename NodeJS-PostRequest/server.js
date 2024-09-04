import server, { Solution } from "./index.js";
const port = 5000;

server.listen(port, () => {
  Solution();
  console.log(`Server running on port ${port}`);
});
