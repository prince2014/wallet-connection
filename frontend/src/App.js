import "./App.css"
import Web3 from "web3"
import { useState } from "react"
import fetch from "node-fetch"
import "bootstrap/dist/css/bootstrap.css"
import { Dropdown, DropdownButton } from "react-bootstrap"


const backendUrl = "http://localhost:4000"

function App() {
  const [error, setError] = useState("")
  const [token, setToken] = useState("")
  const [connectedAcclount, setAccount] = useState("")

  const UseBscNetwork = async () => {
    try {
      console.log("Before switch network")
      const switchReslut = await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }],
      });
      console.log(switchReslut)
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902 || switchError.code === -32603) {
        console.log("detected the error")
        try {
          console.log("try to add the bsc network")

          const bscConfig = {
            chainId: '0x38', // A 0x-prefixed hexadecimal string
            chainName: "Binance Smart Chain Mainnet",
            nativeCurrency: {
              name: 'BNB',
              symbol: 'BNB',
              decimals: 18,
            },
            rpcUrls: ['https://black-green-dust.bsc.quiknode.pro/d2dab52c0bc9c6752f9b02608659fa9899b7fc73/'],
            blockExplorerUrls: ["https://bscscan.com/"],
            // iconUrls?: string[]; // Currently ignored.
          }
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [bscConfig],
          });
        } catch (addError) {
          // handle "add" error
          console.error(addError)

          if (addError.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            alert('You must sign the message to continue.');
          } else {
            console.error(error);
          }

          return
        }
      }
      // handle other "switch" errors
      if (switchError.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        alert('You must sign the message to continue.');
      } else {
        console.error(error);
      }
    }
  }
  const handleSignin = async () => {
    try {
      //Nonce to serve as message to be signed
      const getNonce = await fetch(`${backendUrl}/token`)
      const nonce = await getNonce.json()

      //Check if Metamask is installed
      if (!window.ethereum) {
        alert(
          "No browser wallet detected."
        )
        return
      }

      let chainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log(chainId)
      if (chainId !== "0x38") {
        await UseBscNetwork()
      }

      // Detect again to make sure user is using BSC mainnet, because a user may cancel the switch of network after BSC mainnet is added
      chainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log(chainId)
      if (chainId !== "0x38") {
        return
      }

      console.log("After switch network")
      //Get an account from Metamask
      const address = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      if (address.length < 0) {
        setError("No account found. Please, configure an account")
      }

      const web3 = new Web3(Web3.givenProvider)

      //Signs data to unlock account
      const signature = await web3.eth.personal.sign(
        nonce.toString(),
        address[0]
      )

      const data = {
        address: address[0],
        signature,
        nonce,
      }

      //Authenticate user and return a token
      const authentication = await fetch(`${backendUrl}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const token = await authentication.text()
      setToken(token)
      setAccount(data.address)
      setError("")
    } catch (error) {
      console.log(error.message)

      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        alert('You must sign the message to continue.');
      } else {
        console.error(error);
      }
      return
    }
  }

  const handleSignout = () => {
    setAccount("")
  }

  return (
    <div className="App mt-5">
      {
        connectedAcclount === "" ?
          <button onClick={() => handleSignin()} className="btn btn-primary">
            {"Connect Wallet"}
          </button>
          :
          <div>
            <DropdownButton id="dropdown-basic-button" title={connectedAcclount.slice(0, 6) + "..." + connectedAcclount.slice(37, 41)}>
              {/* <Dropdown.Item href="#/action-1">My Profile</Dropdown.Item> */}
              <Dropdown.Item onClick={() => handleSignout()}>Disconect</Dropdown.Item>
            </DropdownButton>

            <div className="mx-auto mt-5 col-6 text-break align-content-center " >
              <h5>Response from backend: </h5>{token}
            </div>
          </div>
      }
    </div>
  )
}

export default App