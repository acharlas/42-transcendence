import { HistoryMatch } from "../game/game-type";
import axiosWithAuth from "./axiosInstances/protectedCalls";

//Get user history.
export const getHistory = async (): Promise<HistoryMatch[]> => {
  return new Promise<HistoryMatch[]>((resolve, reject) => {
    console.log("axios call");
    axiosWithAuth
      .get("/history/me")
      .then((ret) => {
        console.log(ret);
        return resolve(ret.data);
      })
      .catch((e) => {
        console.log("Error in getHistory", e);
        return reject(e);
      });
  });
};
