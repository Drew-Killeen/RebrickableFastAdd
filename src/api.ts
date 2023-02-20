interface Colors {
  label: string;
  num_sets: number;
  num_set_parts: number;
  part_img_url: string;
}

export async function getPartInfo(partNum: string, apiKey: string) {
  const url = `https://rebrickable.com/api/v3/lego/parts/${partNum}/?key=${apiKey}`;
  let response = await fetch(url);
  return await response;
}

export async function getPartColors(partNum: string, apiKey: string) {
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
