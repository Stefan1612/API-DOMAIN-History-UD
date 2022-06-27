import React, { useState /* , useEffect  */ } from "react";
import { Box, Button, Typography, Container, Input } from "@mui/material";
import axios from "axios";
/* import { ethers } from "ethers"; */
const Home = () => {
  const [domain, setDomain] = useState("");
  const [transferArray, setTransferArray] = useState([]);
  /*  const [transferHistoryFetched, setTransferHistoryFetched] = useState(false); */
  // eslint-disable-next-line
  const [registry, setRegistry] = useState("");
  const [currentOwner, setCurrentOwner] = useState("");
  function handleDomainChange(e) {
    setDomain(e);
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
    console.log(memoryArray);
    /*  setTransferHistoryFetched(true); */
    setTransferArray(memoryArray);
    getNftImage();
  }
  /*  const [ID, setID] = useState(""); */

  async function getNftImage() {
    let result = await axios.get(
      `https://unstoppabledomains.g.alchemy.com/domains/${domain}`,
      { headers: { Authorization: AuthStr } }
    );
    console.log(result.data);
    setRegistry(result.data.meta.registry);
    setCurrentOwner(result.data.meta.owner);
    // setID(result.data.records.ipfs.html.value);
  }

  const [domainGallery, setDomainGallery] = useState([]);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [counter, setCounter] = useState(4);

  async function generateDomainGallery() {
    // eslint-disable-next-line
    if (domainGallery == "") {
      let result = await axios.get(
        `https://unstoppabledomains.g.alchemy.com/domains/?owners=${currentOwner}&sortBy=id&sortDirection=DESC&perPage=2`,
        { headers: { Authorization: AuthStr } }
      );

      setDomainGallery(result.data.data);
      setButtonPressed(true);
    } else {
      let result = await axios.get(
        `https://unstoppabledomains.g.alchemy.com/domains/?owners=${currentOwner}&sortBy=id&sortDirection=DESC&perPage=${counter}`,
        { headers: { Authorization: AuthStr } }
      );
      // eslint-disable-next-line
      if (result.data.data != "") {
        const newCounter = counter + 2;
        setCounter(newCounter);
        /* let memoryArray = domainGallery;
        for (let i = 0; i < 2; i++) {
          memoryArray.push(result.data.data[i]);
        } */

        setDomainGallery(result.data.data);

        /* setButtonPressed(true); */
      } else {
        console.log("alert");
        window.alert("Seems like we already fetched all domains");
      }
    }
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
                padding: "2px",
                borderRadius: "4px",
                paddingBottom: "4px",
                paddingLeft: "15px",
              }}
              variant="filled"
              placeholder="Enter Domain"
              onChange={(e) => handleDomainChange(e.target.value)}
            ></Input>
            &nbsp;
            <Button variant={"contained"} onClick={(e) => alchemyUD()}>
              get transfer History
            </Button>
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
            <Box>
              <Typography>
                Interested in seeing the domain's owner domain gallery?
                <br></br>If so, press this button!
              </Typography>
              <Button
                variant={"contained"}
                onClick={(e) => generateDomainGallery(e)}
              >
                Press me :)
              </Button>
            </Box>
          </Box>
        )}
        {buttonPressed && (
          <Box
            style={{
              border: "solid",
              margin: "10px",
              padding: "10px",
              paddingLeft: "30px",
              borderWidth: "2px",
              textAlign: "left",
              color: "black",
              backgroundColor: "white",
            }}
          >
            Domain Gallery of current Owner address
          </Box>
        )}
        {buttonPressed &&
          domainGallery.map((e) => {
            return (
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
                {e.id}
              </Box>
            );
          })}
        {buttonPressed && (
          <Box style={{}}>
            <Button
              variant={"contained"}
              onClick={(e) => generateDomainGallery()}
            >
              Load more
            </Button>
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
              color: "black",
              backgroundColor: "white",
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
                {/* <Box>
                  <img src={`https://ipfs.infura.io/ipfs/${ID}`}></img>
                </Box> */}
              </Box>
            );
          })}
      </Container>
    </Box>
  );
};

export default Home;
