import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./Header";
import { getPartInfo, getPartColors } from "./api";

import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";

interface Colors {
  label: string;
  num_sets: number;
  num_set_parts: number;
  part_img_url: string;
}

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [partNum, setPartNum] = useState("");
  const [partQuantity, setPartQuantity] = useState("");
  const [partInfo, setPartInfo] = useState<any>({});
  const [partImg, setPartImg] = useState<string>("");
  const [partError, setPartError] = useState("");
  const [partIsFound, setPartIsFound] = useState(false);
  const [colorOptions, setColorOptions] = useState<Colors[]>([]);
  const [selectedColor, setSelectedColor] = useState<Colors | null>(null);
  const [colorInputValue, setColorInputValue] = useState("");

  useEffect(() => {
    if (partIsFound) {
      const callGetPartColors = async () => {
        let allColors: any = await getPartColors(partNum, apiKey);
        setColorOptions(allColors);
      };

      callGetPartColors().catch(console.error);
    }
  }, [partIsFound]);

  useEffect(() => {
    if (selectedColor?.part_img_url) setPartImg(selectedColor.part_img_url);
  }, [selectedColor]);

  const handlePartNumChange = async (value: string) => {
    setPartNum(value);
    let partInfoIncoming = await getPartInfo(value, apiKey);
    if (partInfoIncoming.status == 200) {
      let newPartInfo = await partInfoIncoming.json();
      setPartInfo(newPartInfo);
      setPartImg(newPartInfo.part_img_url);
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
                <Autocomplete
                  getOptionLabel={(option) => option.label}
                  options={colorOptions}
                  value={selectedColor}
                  onChange={(event: any, newValue: Colors | null) => {
                    setSelectedColor(newValue);
                  }}
                  inputValue={colorInputValue}
                  onInputChange={(event, newInputValue) => {
                    setColorInputValue(newInputValue);
                  }}
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
                <img src={partImg} />
              </div>
            </>
          )}
          <div>{partError}</div>
        </div>
      </Container>
    </>
  );
}
