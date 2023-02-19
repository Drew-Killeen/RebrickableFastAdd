import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./Header";

import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [partNum, setPartNum] = useState("");
  const [partColor, setPartColor] = useState("");

  useEffect(() => {
    const savedApiKey = localStorage.getItem("rebrickableApiKey");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleSubmit = async () => {
    console.log(await getPartInfo(partNum, apiKey));
  };

  const updateApiKey = (val: string) => {
    setApiKey(val);
    localStorage.setItem("rebrickableApiKey", val);
  };

  return (
    <>
      <Header />
      <Container maxWidth="xl" className="main-container">
        <TextField
          id="outlined-basic"
          label="API Key"
          variant="outlined"
          sx={{ width: "45ch" }}
          value={apiKey}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateApiKey(e.target.value);
          }}
        />
        <br />
        <br />
        <TextField
          id="outlined-basic"
          label="Part Number"
          variant="outlined"
          value={partNum}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPartNum(e.target.value);
          }}
        />
        <TextField
          id="outlined-basic"
          label="Color"
          variant="outlined"
          value={partColor}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPartColor(e.target.value);
          }}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </Container>
    </>
  );
}

async function getPartInfo(partNum: string, apiKey: string) {
  const url = `https://rebrickable.com/api/v3/lego/parts/${partNum}/?key=${apiKey}`;
  let response = await fetch(url);
  return await response.json();
}

async function getPartColors(partNum: string, apiKey: string) {
  const url = `https://rebrickable.com/api/v3/lego/parts/${partNum}/?key=${apiKey}`;
  let response = await fetch(url);
  return await response.json();
}
