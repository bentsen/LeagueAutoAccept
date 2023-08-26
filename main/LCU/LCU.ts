import { exec } from "child_process";
import axios from "axios";
import https from "https";
import { ClientRequest } from "http";

export default () => {
  //execute command to find data
  return {
    getLeagueAuth(): Promise<string[]> {
      console.log("i am runnning get league auth");
      return new Promise((resolve, reject) => {
        exec(
          "wmic PROCESS WHERE name='LeagueClientUx.exe' GET commandline",
          (error, stdout, stderr) => {
            if (error) {
              console.log(`error: ${error.message}`);
              reject("error");
            }
            if (stderr) {
              console.log(`stderr: ${stderr}`);
              reject("stderr");
            }
            const output = stdout;

            //find the Port in data by matching regex
            const portMatch = RegExp(/--app-port="?(\d+)"?/).exec(output);
            const port = portMatch ? portMatch[1] : null;
            console.log("port: ", port);

            //find the Auth Token in data by matching regex
            const authTokenMatch = RegExp(
              /--remoting-auth-token=([a-zA-Z0-9_-]+)/
            ).exec(output);
            const authToken = authTokenMatch ? authTokenMatch[1] : null;
            console.log("auth: ", authToken);

            const auth = "riot:" + authToken;
            const authBase64 = Buffer.from(auth, "utf-8").toString("base64");
            resolve([authBase64, port]);
          }
        );
      });
    },

    async clientRequest(
      method: string,
      url: string,
      leagueAuth: string[],
      body: string = null
    ) {
      console.log("0", leagueAuth[0]);
      console.log("1", leagueAuth[1]);
      const handler = new https.Agent({
        rejectUnauthorized: false,
      });
      console.log("i am runnning get clientRequest");
      try {
        const client = axios.create({
          baseURL: `https://127.0.0.1:${leagueAuth[1]}/`,
          httpsAgent: handler,
        });

        client.defaults.headers.common[
          "Authorization"
        ] = `Basic ${leagueAuth[0]}`;

        let response;
        if (method === "POST") {
          response = await client.post(url, body);
        } else {
          response = await client.get(url);
        }

        const statusCode = response.status;
        const statusString = statusCode.toString();
        const responseFromServer = response.data;

        return [statusString, responseFromServer];
      } catch (error) {
        if (!error.response) {
          return ["999", ""]; // League client closed or other error
        }

        const statusCode = error.response.status;
        const statusString = statusCode.toString();
        const responseFromServer = error.response.data;

        return [statusString, responseFromServer];
      }
    },
  };
};
