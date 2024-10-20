"use client"; // 如果你在 Next.js 13 中使用 App Router
import { useEffect, useState, useRef } from "react";
import { ethers, Log } from "ethers";
import { abi } from "/public/abi";
import { contract } from "/public/abi";
import { url } from "/public/abi";

const Form = () => {

  const [tick, setTick] = useState('');
  const [max, setMax] = useState('21000000');
  const [limit, setLimit] = useState('1000');
  const [maxMint, setMaxMint] = useState('20000');
  const [mintPrice, setMintPrice] = useState('0');
  const [reserve, setReserve] = useState('0');

  const [errorMessage, setErrorMessage] = useState("");
  const [Deploy, setDeploy] = useState('Deploy');

  async function deploy() {
    if (localStorage.getItem('walletAddress') == undefined) {
      setErrorMessage('Please connect wallet');
      document.getElementById('my_modal').showModal();
      return;
    }

    if (tick == '') {
      setErrorMessage('Please enter tick');
      document.getElementById('my_modal').showModal();
      return;
    }

    if (max == '' || max <= 0) {
      setErrorMessage('Please enter max');
      document.getElementById('my_modal').showModal();
      return;
    }

    if (limit == '' || limit <= 0) {
      setErrorMessage('Please enter correctly limit');
      document.getElementById('my_modal').showModal();
      return;
    }

    if (Number(limit) > Number(max)) {
      setErrorMessage('limit cannot be greater than max');
      document.getElementById('my_modal').showModal();
      return;
    }
    setDeploy('Loading...');
    try {
      const wallet = ethers.Wallet.createRandom()
      const provider = new ethers.JsonRpcProvider(url)
      const signer = wallet.connect(provider);
      const thisContract = new ethers.Contract(contract, abi, signer);
      const deployData = await thisContract.depyoyData(tick, max, limit, maxMint, mintPrice, reserve);
      let userProvider = new ethers.BrowserProvider(window.ethereum);
      const userSigner = await userProvider.getSigner();
      const transaction = await userSigner.sendTransaction({
        to: contract,
        data: deployData[1],
        value: ethers.parseEther("0.02")
      })

      await transaction.wait();
      setErrorMessage('Deploy successful ');
      document.getElementById('my_modal').showModal();
      setIsOpenIsFalse();
      setDeploy('Deploy');
    } catch (error) {
      if (error.toString().includes('Insufficient deployment fee')) {
        setErrorMessage('Insufficient deployment fee');
      } else if (error.toString().includes('Token already exists')) {
        setErrorMessage('Token already exists');
        setTick('');
      } else if (error.toString().includes('User denied transaction signature')) {
        setErrorMessage('User denied transaction signature');
      } 
      setDeploy('Deploy');
      if(errorMessage != ''){
        document.getElementById('my_modal').showModal();
      }
    }
  }

  function setIsOpenIsFalse() {
    setTick('');
    setMax('');
    setLimit('');
    setMaxMint('');
    setMintPrice('');
    setReserve('');
  }

  return (
    <div className="flex items-center justify-center flex-col text-center sm:mt-10 mb-5">
      <div className="flex flex-col items-center border-2 border-sky-100 rounded-2xl shadow-[2px_2px_0px_1px_#E99F4C] p-6 md:p-10 w-[95%] sm:w-[450px]  mx-4"> {/* 手机端更小，Web端保持 */}
        <div className="flex items-center">
          <p className="text-[#264143] font-bold text-xl sm:text-2xl">Deploy</p>
          <div className="relative group inline-flex ml-2 items-center">
            <span className="flex items-center justify-center w-5 h-5 border border-gray-400 rounded-full text-gray-900 cursor-pointer">
              !
            </span>

            <div className="absolute bottom-full mb-2 left-[-150%] transform -translate-x-1/2 w-max px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              deployment requires a payment of 0.02 ETH to the platform!
            </div>
          </div>
        </div>

        <form action="">
          <div className="flex flex-col items-baseline mb-4">
            <label className="font-semibold mt-2">Tick</label>
            <input
              placeholder="Enter Tick"
              className="outline-none border-2 border-sky-200 shadow-[2px_2px_0px_1px_#E99F4C] w-full sm:w-[290px] p-2 rounded-md text-base focus:border-[#E99F4C] focus:shadow-[1px_2px_0px_0px_#E99F4C] transition-transform transform focus:translate-y-[4px]"
              type="text"
              value={tick}
              onChange={(e) => setTick(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-baseline mb-4">
            <label className="font-semibold mt-2">Max Supply</label>
            <input
              placeholder="Enter Max Supply"
              className="outline-none border-2 border-sky-200 shadow-[2px_2px_0px_1px_#E99F4C] w-full sm:w-[290px] p-2 rounded-md text-base focus:border-[#E99F4C] focus:shadow-[1px_2px_0px_0px_#E99F4C] transition-transform transform focus:translate-y-[4px]"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              type="number"
            />
          </div>
          <div className="flex flex-col items-baseline mb-4">
            <label className="font-semibold mt-2">Limit Per Mint</label>
            <input
              placeholder="Enter Limit Per Mint"
              className="outline-none border-2 border-sky-200 shadow-[2px_2px_0px_1px_#E99F4C] w-full sm:w-[290px] p-2 rounded-md text-base focus:border-[#E99F4C] focus:shadow-[1px_2px_0px_0px_#E99F4C] transition-transform transform focus:translate-y-[4px]"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              type="number"
            />
          </div>
          <div className="flex flex-col items-baseline mb-4">
            <label className="font-semibold mt-2">Max Mint (Per address)</label>
            <input
              placeholder="Enter Max Mint"
              className="outline-none border-2 border-sky-200 shadow-[2px_2px_0px_1px_#E99F4C] w-full sm:w-[290px] p-2 rounded-md text-base focus:border-[#E99F4C] focus:shadow-[1px_2px_0px_0px_#E99F4C] transition-transform transform focus:translate-y-[4px]"
              value={maxMint}
              onChange={(e) => setMaxMint(e.target.value)}
              type="number"
            />
          </div>
          <div className="flex flex-col items-baseline mb-4">
            <label className="font-semibold mt-2">Mint Price (Symbol $ETH)</label>
            <input
              placeholder="Enter Mint Price"
              className="outline-none border-2 border-sky-200 shadow-[2px_2px_0px_1px_#E99F4C] w-full sm:w-[290px] p-2 rounded-md text-base focus:border-[#E99F4C] focus:shadow-[1px_2px_0px_0px_#E99F4C] transition-transform transform focus:translate-y-[4px]"
              value={mintPrice}
              onChange={(e) => setMintPrice(e.target.value)}
              type="number"
            />
          </div>
          <div className="flex flex-col items-baseline mb-4">
            <label className="font-semibold mt-2">Reserve tokens(Sent deployer)</label>
            <input
              placeholder="Enter Reserve"
              className="outline-none border-2 border-sky-200 shadow-[2px_2px_0px_1px_#E99F4C] w-full sm:w-[290px] p-2 rounded-md text-base focus:border-[#E99F4C] focus:shadow-[1px_2px_0px_0px_#E99F4C] transition-transform transform focus:translate-y-[4px]"
              value={reserve}
              onChange={(e) => setReserve(e.target.value)}
              type="number"
            />
          </div>
          <div>
            <button className="bg-blue-200 rounded-lg font-bold text-base py-2 mb w-full sm:w-[290px] shadow-[2px_2px_0px_0px_#E99F4C] transition-transform transform focus:translate-y-[4px] focus:shadow-[1px_2px_0px_0px_#E99F4C] hover:opacity-90"
              onClick={deploy}
              type="button"
            >
              {Deploy}
            </button>
          </div>
        </form>
      </div>
      <div>
        <dialog id="my_modal" className="modal-box text-center">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            <p>{errorMessage}</p>
          </form>
        </dialog>
      </div>
    </div>
  );
};

export default Form;
