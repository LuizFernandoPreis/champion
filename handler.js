const express = require("express");
const { google } = require("googleapis");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function setValue(index) {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = "1082yiGlZI6bEV2SUZCc9yKUhAwEqs84L-zPj_-RUkTg";

  await googleSheets.spreadsheets.values.update({
    spreadsheetId,
    range: `Sheet1!P${index}:P${index}`,
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [["1"]],
    },
  });
}

async function onUpdate() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  try {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });
    const spreadsheetId = "1082yiGlZI6bEV2SUZCc9yKUhAwEqs84L-zPj_-RUkTg";

    const range = `Sheet1`;
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    let filteredRows = rows.filter(
      (row) => row[15] != "1"
    );

    for (let i = 0; i < rows.length; i++) {
      let atual = rows[i];
      if (atual[15] != "1") {
        await setValue(i + 1); 
      }
    }

    return filteredRows;
  } catch (error) {
    console.error(error);
  }
}

app.get("/", async (req, res) => {
  const { filterValue } = req.query;

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  try {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });
    const spreadsheetId = "1082yiGlZI6bEV2SUZCc9yKUhAwEqs84L-zPj_-RUkTg";

    const range = `Sheet1`;
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    let filteredRows = rows.filter(
      (row) => row[2] === filterValue && row[9] != "Pronto"
    );

    res.json(filteredRows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

app.get("/pronto", async (req, res) => {
  const data = await onUpdate();
  res.json(data);
});

app.listen(1337, () => {
  console.log("Server running on http://0.0.0.0:1337");
});
