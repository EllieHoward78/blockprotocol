import React from "react";
import { Typography, Box } from "@mui/material";
import { Link } from "../../Link";
import { Spacer } from "../../Spacer";
import { Button } from "../../Button";

export const RegistrySection = () => {
  return (
    <Box
      sx={{
        mb: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="bpHeading2" mb={3}>
        Tap into a global registry of reusable blocks
      </Typography>
      <Typography sx={{ mb: 6, width: "55%" }}>
        As a developer, building your applications using the Block Protocol will
        give you access to a global registry of reusable, flexible blocks to
        embed inside your application. All connected to powerful structured data
        formats.
      </Typography>

      <Box
        sx={{
          backgroundColor: ({ palette }) => palette.gray[20],
          height: 480,
          width: "100%",
          mb: 6,
        }}
      />
      {/* @todo use Link instead */}
      <Box sx={{ textAlign: "center", width: "40%", maxWidth: 540 }}>
        <Button variant="secondary">Explore all Blocks</Button>
        <Spacer height={4} />
        <Box>
          Anyone can build new blocks and submit them to the registry. If you
          can’t see the block type you want,{" "}
          <Link href="/">start building it today.</Link>
        </Box>
      </Box>
    </Box>
  );
};
