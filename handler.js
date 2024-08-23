const express = require("express");
const { google } = require("googleapis");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
  const { filterValue } = req.query;

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets.readonly",
  });

  try {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });
    const spreadsheetId = "184HbEzbE4_lI-7yhlVb7MQ34HKYdKlHG-6lb8T13InE";

    const range = `Sheets1`;
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    let filteredRows = rows.filter(
      (row) => row[2] === filterValue && row[8] != "Pronto"
    );

    res.json(filteredRows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

app.listen(1337, () => console.log("Server running on http://localhost:1337"));
