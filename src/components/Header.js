import React, { useEffect, useState } from 'react'
import {Navbar,Container,Nav} from 'react-bootstrap'
import logo from '../img/logo1.png'
import Web3Modal from 'web3modal'
import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers, ethers } from "ethers";
import Web3 from "web3";
let web3Modal;
let provider;
let selectedAccount;
function init() {
    const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            // Mikko's test key - don't copy as your mileage may vary
            // infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
            rpc: {
                56:"https://bsc-dataseed.binance.org/"
              },
            chainId:56
          }
        },
    
        
      };

    web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions // required
    });

    window.w3m = web3Modal;
}

async function fetchAccountData() {
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    selectedAccount = await signer.getAddress();
    console.log(selectedAccount);
    
    return selectedAccount;
}

async function refreshAccountData() {
    await fetchAccountData(provider);
}

async function onConnect() {
    console.log("Opening a dialog", web3Modal);
    try {
        provider = await web3Modal.connect({ cacheProvider: true });
    } catch (e) {
        console.log("Could not get a wallet connection", e);
        return;
    }

    provider.on("accountsChanged", (accounts) => {
        console.log('chainchan',accounts)
        fetchAccountData();
        // window.location.reload()
    });

    provider.on("chainChanged", (chainId) => {
        fetchAccountData();
        window.location.reload()
    });

    provider.on("networkChanged", (networkId) => {
        fetchAccountData();
    });
    window.location.reload()

    await refreshAccountData();
}



async function disconnet() {
    console.log("Opening a dialog", web3Modal);
    try {
        // provider = await web3Modal.connect();
        

        await web3Modal.clearCachedProvider();
        // await window.ethereum.disable()
        window.location.reload()
    } catch (e) {
        console.log("Could not get a wallet connection", e);
        return;
    }

   
}

function Header({change,web3m,provider1}) {
    const [acc,setacc] = useState()
    const [isDarkMode, setIsDarkMode] = useState(() => true);
    console.log('dark', isDarkMode)
    const [accountid, setaccountid] = useState()
    useEffect(() => {
        // change()
        localStorage.setItem('dark', isDarkMode)

    }, [isDarkMode])
    useEffect(async () => {

        if (acc) {
            // const accounts1 = await window.ethereum.request({ method: 'eth_requestAccounts' });
            // setaccountid(accounts1[0])
            provider = await web3Modal.connect();
            const web3 = new Web3(provider);
            const accounts = await web3.eth.getAccounts();
            console.log('dddd',accounts)
            web3m(web3)
            provider1(provider)
            setaccountid(accounts[0])


        }


    }, [acc]);
    const [ndark, setndark] = useState()
    const dark = localStorage.getItem('dark')
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [account, setAccount] = useState();
  
    useEffect(() => {
        init();
        change(false)
        if (web3Modal.cachedProvider) {
            console.log('accaa',web3Modal.cachedProvider)
            console.log("connected");
            setacc(true)
            change(true)
        }
    }, []);
    
    return (
        <div>
            <Navbar expand="lg" className='m-0'>
                <Container>
                    <Navbar.Brand href="/">
                        <img src={logo} style={{width:'100px'}} classname="img-fluid" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link href="/" className='mx-md-5 mt-2 mt-md-0'>Home</Nav.Link>
                            {/* <Nav.Link href="/mystack" className='mx-md-5  mt-2 mt-md-0'>My Stack</Nav.Link> */}
                            {/* <Nav.Link href="#contact" className='mr-md-5'>Contact</Nav.Link>
                            <Nav.Link href="#why" className='mr-md-5'>Why Santa?</Nav.Link>
                            <Nav.Link href="#air" className='mr-md-5'>Airdrop</Nav.Link> */}
                            {/* <Nav.Link  className='mr-md-5 ctnbtn' onClick={()=>window.location.reload()} >Connect to wallet</Nav.Link> */}
                            {  acc ?
                             <>  <Nav.Link className="mx-md-5 ctnbtn  mt-2 mt-md-0" style={{fontSize:'15px',width:'180px',wordBreak:'break-all'}}>{accountid?.slice(0,3)}.....{accountid?.slice(-3)}<br/></Nav.Link>
                             <Nav.Link onClick={disconnet}  className="mx-md-5 ctnbtn  mt-5 mt-md-0">Logout</Nav.Link>
                             </>:<Nav.Link onClick={onConnect} className="mx-md-5 ctnbtn  mt-2 mt-md-0"><i className="icon-wallet mr-md-2" />Wallet Connect</Nav.Link>
                               
                           }
                            
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}

export default Header
