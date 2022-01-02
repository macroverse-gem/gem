import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

import svg64 from "svg64";
import renderGEM from "./renderGEM";

function NFTItem({ tokenId }) {
  const [loading, setLoading] = useState(false);
  const [SVG, setSVG] = useState(null);

  useEffect(() => {
    loadSVG(tokenId);
  }, [tokenId]);

  async function loadSVG(id) {
    try {
      setLoading(true);

      const svg = await renderGEM(id);
      const base64FromSvg = svg64(svg);
      setSVG(base64FromSvg);
    } finally {
      setLoading(false);
    }
  }

  return <Box sx={{ width: "30%", display: "inline-block", margin: 3, "& > img": { width: "100%" } }}>{loading && !SVG ? <Box>loading...</Box> : <img src={SVG} alt="svg" />}</Box>;
}

export default React.memo(NFTItem);
