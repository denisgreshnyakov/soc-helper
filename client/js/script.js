import pageUp from "./modules/pageUp";
import { editContent, ip, port } from "./modules/editContent";
import {
  submitComparingData,
  submitJoiningData,
  submitListingData,
} from "./services/requests";

window.addEventListener("DOMContentLoaded", () => {
  "use strict";

  pageUp();
  editContent();
  submitComparingData(ip, port);
  submitJoiningData(ip, port);
  submitListingData(ip, port);
});
