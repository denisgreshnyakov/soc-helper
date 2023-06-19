import pageUp from "./modules/pageUp";
import { editContent, ip, port } from "./modules/editContent";
import { submitComparingData, submitJoiningData } from "./services/requests";

window.addEventListener("DOMContentLoaded", () => {
  "use strict";

  pageUp();
  editContent();
  submitComparingData(ip, port);
  submitJoiningData(ip, port);
});
