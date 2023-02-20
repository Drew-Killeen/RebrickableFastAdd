import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./Header";

import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

interface Colors {
  label: string;
  num_sets: number;
  num_set_parts: number;
  part_img_url: string;
}

export default function App() {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const savedApiKey = localStorage.getItem("rebrickableApiKey");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const updateApiKey = (val: string) => {
    setApiKey(val);
    localStorage.setItem("rebrickableApiKey", val);
  };

  return (
    <>
      <Header />
      <Container maxWidth="xl" className="main-container">
        <SettingsFields apiKey={apiKey} updateApiKey={updateApiKey} />
        <PartFields apiKey={apiKey} />
      </Container>
    </>
  );
}

function SettingsFields({
  apiKey,
  updateApiKey,
}: {
  apiKey: string;
  updateApiKey: (val: string) => void;
}) {
  return (
    <>
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
    </>
  );
}

function PartFields({ apiKey }: { apiKey: string }) {
  const [partNum, setPartNum] = useState("");
  const [partQuantity, setPartQuantity] = useState("");
  const [partInfo, setPartInfo] = useState<any>({});
  const [partError, setPartError] = useState("");
  const [partIsFound, setPartIsFound] = useState(false);

  const handlePartNumChange = async (value: string) => {
    setPartNum(value);
    let partInfoIncoming = await getPartInfo(value, apiKey);
    if (partInfoIncoming.status == 200) {
      setPartInfo(await partInfoIncoming.json());
      setPartError("");
      setPartIsFound(true);
    } else {
      setPartInfo({});
      setPartIsFound(false);
      setPartError("Error: Cannot find part");
    }
  };

  const handleSubmit = () => {
    // TODO
  };

  return (
    <div className="part-field">
      <span className="text-input-field">
        <TextField
          id="outlined-basic"
          label="Part Number"
          variant="outlined"
          value={partNum}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handlePartNumChange(e.target.value);
          }}
        />
      </span>
      {partIsFound && (
        <>
          <span className="text-input-field">
            <ColorSearchField partNum={partNum} apiKey={apiKey} />
          </span>

          <span className="text-input-field">
            <TextField
              id="outlined-basic"
              label="Quantity"
              variant="outlined"
              value={partQuantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPartQuantity(e.target.value);
              }}
            />
          </span>
          <span className="submit-button">
            <Button variant="outlined" onClick={handleSubmit}>
              Submit
            </Button>
          </span>
        </>
      )}

      {partInfo.name && (
        <>
          <div className="part-title">{partInfo.name}</div>
          <div>
            <img src={partInfo.part_img_url} />
          </div>
        </>
      )}
      <div>{partError}</div>
    </div>
  );
}

function ColorSearchField({
  partNum,
  apiKey,
}: {
  partNum: string;
  apiKey: string;
}) {
  const [options, setOptions] = useState<Colors[]>([]);
  const [value, setValue] = useState<Colors | null>(options[0]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const callGetPartColors = async () => {
      let allColors: any = await getPartColors(partNum, apiKey);
      setOptions(allColors);
    };

    callGetPartColors().catch(console.error);
  }, [partNum]);

  return (
    <Autocomplete
      getOptionLabel={(option) => option.label}
      options={options}
      value={value}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Color"
          InputProps={{
            ...params.InputProps,
            endAdornment: <>{params.InputProps.endAdornment}</>,
          }}
        />
      )}
    />
  );
}

async function getPartInfo(partNum: string, apiKey: string) {
  const url = `https://rebrickable.com/api/v3/lego/parts/${partNum}/?key=${apiKey}`;
  let response = await fetch(url);
  return await response;
}

async function getPartColors(partNum: string, apiKey: string) {
  const url = `https://rebrickable.com/api/v3/lego/parts/${partNum}/colors/?key=${apiKey}`;
  let response = await fetch(url);
  if (response.status !== 200) {
    return {};
  }
  let partColors = await response.json();
  let partColorsMapped: Colors[] = new Array(partColors.results.length);
  for (let i = 0; i < partColors.results.length; i++) {
    partColorsMapped[i] = {
      label: partColors.results[i].color_name,
      num_sets: partColors.results[i].num_sets,
      num_set_parts: partColors.results[i].num_set_parts,
      part_img_url: partColors.results[i].part_img_url,
    };
  }
  return partColorsMapped;
}
