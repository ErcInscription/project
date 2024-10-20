
"use client";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Link from 'next/link';

function navbar() {

  useEffect(() => {
    setInterval(() => {
      const address = localStorage.getItem('walletAddress');
      if (address != undefined) {
        const textContent0 = address.substring(0, 4) + "****" + address.substring(38, address.length);
        setTextContent(textContent0)
      }
    }, 1000);
  })

  useEffect(() => {
    getMetaMask();
  })

  let web3Provider
  let walletAddress;
  let sing;

  const [textContent, setTextContent] = useState("Connect Wallet");
  async function getMetaMask() {

    if (window.ethereum) {
      web3Provider = window.ethereum;

      try {
        await window.ethereum.enable();
      } catch (error) {
        await window.ethereum.enable();
        web3Provider = window.web3.currentProvider;
      }
    } else {
      try {
        await window.ethereum.enable();
        web3Provider = window.web3.currentProvider;
      } catch (error) {
        console.log(error);

      }
    }
    try {
      let provider = new ethers.BrowserProvider(web3Provider)
      sing = await provider.getSigner();
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      walletAddress = accounts[0];

      const textContent0 = walletAddress.substring(0, 4) + "****" + walletAddress.substring(38, walletAddress.length);
      setTextContent(textContent0)


      window.sing = sing;
      window.walletAddress = walletAddress;
      localStorage.setItem('walletAddress', walletAddress);
      localStorage.setItem('sing', sing);

      if ((await provider.getNetwork()).chainId !== 97) {
        await switchToNetwork();
      }
    } catch (error) {
      console.log(error);

    }
  }

  async function switchToNetwork() {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1" }],
      });
    } catch (switchError) {
      console.error("Error switching network:", switchError);
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x1", 
                chainName: "Ethereum Mainnet",
                rpcUrls: ["https://eth.llamarpc.com"],
                nativeCurrency: {
                  name: "Ether",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://etherscan.io"],
              },
            ],
          });
          console.log("Ethereum Mainnet added successfully.");
        } catch (addError) {
          console.error("Error adding network:", addError);
        }
      }
    }
  }



  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => setMenuOpen(!menuOpen);

  const handleMenuItemClick = (() => {
    setMenuOpen(false)
  })
  return (

    <div className="navbar justify-center font-config">
      <Link href="/" className="flex fixed top-0 left-0 text-xl m-4 font-config ">
        <svg
          width="90"
          height="90"
          className="-mt-2"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(100, 100)">
            <g transform="translate(-100, -100)">
              <image href="https://cryptologos.cc/logos/ethereum-eth-logo.svg" width="100" height="100" />
            </g>
            <g transform="translate(-200, -100) rotate(90 100 100)">
              <image href="https://cryptologos.cc/logos/ethereum-eth-logo.svg" width="100" height="100" opacity="0.8" />
            </g>
          </g>
        </svg>

      </Link>
      <div className="hidden sm:flex sm:space-x-4 fixed">
        <Link href="/" className="btn btn-ghost text-xl font-config ">Home</Link>
        <Link href="/pages/Deploy" className="btn btn-ghost text-xl font-config">Deploy</Link>
        <Link href="/pages/ContactUs" className="btn btn-ghost text-xl font-config">Contact us</Link>
      </div>
      <button className="btn btn-neutral fixed right-0 m-4" onClick={() => {
        getMetaMask();
      }}>{textContent}</button>

      <div className="dropdown dropdown-end sm:hidden fixed z-50">
        <label tabIndex={0} className="btn btn-ghost text-xl font-config mr-24" onClick={handleMenuToggle}>
          Menu
          <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </label>

        <ul tabIndex={0} className={`menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 font-config absolute right-0 ${menuOpen ? 'block' : 'hidden'}`} style={{ zIndex: 9999 }}>
          <li><Link href="/" onClick={handleMenuItemClick}>Home</Link></li>
          <li><Link href="/pages/Deploy" onClick={handleMenuItemClick}>Deploy</Link></li>
          <li><Link href="/pages/ContactUs" onClick={handleMenuItemClick}>Contact us</Link></li>
        </ul>
      </div>


    </div>
  );
}

export default navbar