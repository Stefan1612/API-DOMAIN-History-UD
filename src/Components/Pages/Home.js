import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Container, Input } from "@mui/material";
import axios from "axios";
import { ethers } from "ethers";
const Home = () => {
  const [domain, setDomain] = useState("");
  const [transferArray, setTransferArray] = useState([]);
  const [transferHistoryFetched, setTransferHistoryFetched] = useState(false);
  const [registry, setRegistry] = useState("");
  const [currentOwner, setCurrentOwner] = useState("");
  function handleDomainChange(e) {
    setDomain(e);
    console.log(domain);
  }
  const AuthStr = "Bearer ".concat(process.env.REACT_APP_ALCHEMY_API_KEY);
  async function alchemyUD() {
    let memoryArray = [];
    if (domain === "") {
      return window.alert("You need to enter a domain");
    }
    let result = await axios.get(
      `https://unstoppabledomains.g.alchemy.com/domains/${domain}/transfers/latest`,
      { headers: { Authorization: AuthStr } }
    );

    result.data.data.forEach((e) => {
      memoryArray.push(e);
    });

    setTransferHistoryFetched(true);
    setTransferArray(memoryArray);
    getNftImage();
  }

  async function getNftImage() {
    let result = await axios.get(
      `https://unstoppabledomains.g.alchemy.com/domains/${domain}`,
      { headers: { Authorization: AuthStr } }
    );
    console.log(result.data.meta);
    setRegistry(result.data.meta.registry);
    setCurrentOwner(result.data.meta.owner);
  }

  return (
    <Box
      sx={{
        backgroundColor: "#212121",
        minHeight: "100vh",
        minWidth: "100vw",
        paddingTop: "10vh",
      }}
    >
      <Container>
        <Box
          sx={{
            border: "solid",
            borderColor: "white",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          <Box sx={{ color: "white" }}>
            <Typography>
              Enter unstoppable Domain to see its transaction History and the
              current/prior owner/s
            </Typography>
          </Box>{" "}
          <Box>
            <Input
              sx={{
                backgroundColor: "white",
                padding: "5px",
              }}
              variant="filled"
              placeholder="Enter Domain"
              onChange={(e) => handleDomainChange(e.target.value)}
            ></Input>
            <Button onClick={(e) => alchemyUD()}>get transfer History</Button>
          </Box>
        </Box>

        {currentOwner !== "" && (
          <Box
            style={{
              border: "solid",
              margin: "10px",
              padding: "10px",
              paddingLeft: "30px",
              borderWidth: "1px",
              textAlign: "left",
              color: "white",
              marginBottom: "20px",
            }}
          >
            Current Domain Owner: {currentOwner}
          </Box>
        )}
        {transferArray !== "" && (
          <Box
            style={{
              border: "solid",
              margin: "10px",
              padding: "10px",
              paddingLeft: "30px",
              borderWidth: "2px",
              textAlign: "left",
              color: "white",
            }}
          >
            <Typography variant={"h5"}>
              Transaction History of THIS Domain
            </Typography>
          </Box>
        )}
        {transferArray !== "" &&
          transferArray.map((e) => {
            return (
              <Box
                style={{
                  border: "solid",
                  margin: "10px",
                  padding: "10px",
                  paddingLeft: "30px",
                  borderWidth: "1px",
                  textAlign: "left",
                  color: "white",
                }}
              >
                {" "}
                <Box>
                  <Typography variant={"h6"}>
                    {e.from === "0x0000000000000000000000000000000000000000" ? (
                      <Box>Domain Minted</Box>
                    ) : (
                      <Box>Domain Traded</Box>
                    )}
                  </Typography>
                </Box>
                <Box> Domain: {e.domain}</Box>
                <Box>To: {e.to}</Box>
                <Box>From: {e.from}</Box>
                <Box> Block Number: {e.blockNumber}</Box>
                <Box> Blockchain: {e.blockchain}</Box>
                <Box>NetworkID: {e.networkId}</Box>
              </Box>
            );
          })}
      </Container>
    </Box>
  );
};

export default Home;
