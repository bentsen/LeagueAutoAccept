import { exec } from "child_process";
import axios from "axios";
import https from "https";

export default () => {
  //execute command to find data
  function getLeagueAuth(): Promise<string[]> {
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
  }
  return {
    async clientRequest(
      method: string,
      url: string,
      body: string | null = null,
      headers: Record<string, string> = {}
    ) {
      const leagueAuth: string[] = await getLeagueAuth();
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

        Object.assign(client.defaults.headers.common, headers);

        let response;

        if (method === "POST") {
          response = await client.post(url, body);
        } else if (method === "PATCH") {
          response = await client.patch(url, body);
        } else {
          response = await client.get(url);
        }

        const statusCode = response.status;
        const statusString = statusCode.toString();
        const responseFromServer = response.data;

        return { status: statusString, response: responseFromServer };
      } catch (error) {
        if (!error.response) {
          return { status: "999", response: undefined }; // League client closed or other error
        }

        const statusCode = error.response.status;
        const statusString = statusCode.toString();
        const responseFromServer = error.response.data;

        return { status: statusString, response: responseFromServer };
      }
    },
  };
};
