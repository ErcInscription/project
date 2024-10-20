"use client"
import { useEffect, useState, useRef } from "react";
import { ThreeDots } from 'react-loader-spinner';
import { ethers, Log } from "ethers";
import { abi } from "/public/abi";
import { contract } from "/public/abi";
import { url } from "/public/abi";

const DetailsPage = () => {
  const [tickName, setTickName] = useState('');
  const [progress, setProgress] = useState('');

  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const [totalSupply, setTotalSupply] = useState('');
  const [minted, setMinted] = useState('');
  const [LimitPerMint, setLimitPerMint] = useState('');
  const [decimal, setDecimal] = useState('18');
  const [holders, setHolders] = useState('');
  const [deploy, setDeploy] = useState('');
  const [maxMint, setMaxMint] = useState('');
  const [mintPrice, setMintPrice] = useState('');
  const [reserve, setReserve] = useState('');
  const [deployTime, setDeployTime] = useState('');

  const [balance, setBalance] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [tick, setTick] = useState('');
  const [receiveAddress, setReceiveAddress] = useState('');
  const [amt, setAmt] = useState('');

  const [mint, setMint] = useState('MINT');
  const [Transfer, setTransfer] = useState('Transfer');
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);

    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('tick');
    setTickName(name);

    const fetchData = async () => {
      const wallet = ethers.Wallet.createRandom();
      const provider = new ethers.JsonRpcProvider(url);
      const signer = wallet.connect(provider);
      const thisContract = new ethers.Contract(contract, abi, signer);
      let token = await thisContract.inscriptions(name);
    
      
      let array = token.toString().split(',');

      setDeployTime(new Date(array[5] * 1000).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
      setHolders(array[6]);
      setTotalSupply((BigInt(array[1]) / BigInt(10 ** 18)).toString());
      setMinted(((Number(array[3])) / (10 ** 18)).toFixed(2));
      setLimitPerMint((BigInt(array[2]) / BigInt(10 ** 18)).toString());
      setMaxMint((BigInt(array[7]) / BigInt(10 ** 18)).toString());
      setMintPrice(array[8] / 10 ** 18);
      setReserve((BigInt(array[9]) / BigInt(10 ** 18)).toString());
      const percentage = (array[3] / 10 ** 18) / (array[1] / 10 ** 18) * 100;
      const flooredPercentage = Math.floor(percentage * 100) / 100;
      const result = flooredPercentage.toFixed(2);
      setProgress(result);
      setDeploy(array[4]);

      if (localStorage.getItem('walletAddress') != undefined) {
        let balances = await thisContract.balances(name, localStorage.getItem('walletAddress'));
        setBalance((Number(balances) / (10 ** 18)).toFixed(2));
      }
    }

    if (!hasFetched.current) {
      fetchData();
      hasFetched.current = true;
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-60">
        <ThreeDots color="#00BFFF" height={80} width={80} />
      </div>
    );
  }

  async function handleTransfer() {
    if (localStorage.getItem('walletAddress') == undefined) {
      setErrorMessage('Please connect wallet')
      document.getElementById('my_modal').showModal();
      return;
    }

    if (tick == '') {
      setErrorMessage('Please enter tick');
      document.getElementById('my_modal').showModal();
      return;
    }

    if (receiveAddress == '' || receiveAddress.length != 42) {
      setErrorMessage('Please enter receive address');
      document.getElementById('my_modal').showModal();
      return;
    }
    console.log(amt, balance);

    if (amt == '' || parseInt(amt) <= 0 || parseInt(amt) > parseInt(balance)) {
      setErrorMessage('Please enter correctly Amt');
      document.getElementById('my_modal').showModal();
      return;
    }
    setTransfer('Loading...');
    try {
      const wallet = ethers.Wallet.createRandom()
      const provider = new ethers.JsonRpcProvider(url)
      const signer = wallet.connect(provider);
      const thisContract = new ethers.Contract(contract, abi, signer)
      const transferData = await thisContract.transferData(tick, receiveAddress, amt);
      let userProvider = new ethers.BrowserProvider(window.ethereum);
      const userSigner = await userProvider.getSigner();
      const transaction = await userSigner.sendTransaction({
        to: contract,
        data: transferData[1],
        value: 0
      })
      await transaction.wait();
      setErrorMessage('Transfer successful');
      document.getElementById('my_modal').showModal();
      setTransfer('Transfer');
      // Clear the input box content
      setIsOpenIsFalse();
    } catch (error) {
      if (error.toString().includes('User denied transaction signature')) {
        setErrorMessage('User denied transaction signature');
      } else if (error.toString().includes('Insufficient balance for transfer')) {
        setErrorMessage('Insufficient balance for transfer');
      }
      setTransfer('Transfer');
      if(errorMessage != ''){
        document.getElementById('my_modal').showModal();
      }
    }

  };
  const handleOpen = () => {
    setTick(tickName);
    setIsOpen(true);
  };

  async function Mint() {

    if (localStorage.getItem('walletAddress') == undefined) {
      setErrorMessage('Please connect wallet')
      document.getElementById('my_modal').showModal();
      return;
    }

    if (progress >= 100) {
      setErrorMessage('Mint Finish');
      document.getElementById('my_modal').showModal();
      return;
    }

    setMint('Loading...');
    try {
      const wallet = ethers.Wallet.createRandom()
      const provider = new ethers.JsonRpcProvider(url);
      const signer = wallet.connect(provider);
      const thisContract = new ethers.Contract(contract, abi, signer);
      const hexData = await thisContract.mintData(tickName, LimitPerMint);
      const token = await thisContract.inscriptions(tickName);
      let userProvider = new ethers.BrowserProvider(window.ethereum);
      const userSigner = await userProvider.getSigner();
      const transaction = await userSigner.sendTransaction({
        to: contract,
        data: hexData[1],
        value: token[8]
      })
      await transaction.wait();
      setErrorMessage('Mint successful');
      setMint('MINT');
      document.getElementById('my_modal').showModal();

    } catch (error) {
      if (error.toString().includes('Minting finished')) {
        setErrorMessage('Minting finished');
      } else if (error.toString().includes('Exceeds available supply')) {
        setErrorMessage('Exceeds available supply');
      } else if (error.toString().includes('amount higher than lim')) {
        setErrorMessage('amt higher than limit');
      } else if (error.toString().includes('User denied transaction signature')) {
        setErrorMessage('User denied transaction signature');
      } else if (error.toString().includes('Exceeds max mint per address')) {
        setErrorMessage('Exceeds max mint per address ');
      }
      setMint('MINT');
      if(errorMessage != ''){
        document.getElementById('my_modal').showModal();
      }
    }
  };

  function setIsOpenIsFalse() {
    setTick('');
    setReceiveAddress('');
    setAmt('');
    setIsOpen(false);
  }

  async function Search() {
    if (searchTerm == '') {
      setErrorMessage('Please enter the correct wallet address');
      document.getElementById('my_modal').showModal();
      return;
    }
    try {
      const wallet = ethers.Wallet.createRandom()
      const provider = new ethers.JsonRpcProvider(url);
      const signer = wallet.connect(provider);
      const thisContract = new ethers.Contract(contract, abi, signer);
      const result = await thisContract.balances(tickName, searchTerm);
      setErrorMessage(tickName + ' Balance: ' + (Number(result) / (10 ** 18)).toFixed(2));
      document.getElementById('my_modal').showModal();

    } catch (error) {
      if (error.toString().includes('unconfigured name')) {
        setErrorMessage('Please enter the correct wallet address');
      } else if (error.toString().includes('network does not support ENS')) {
        setErrorMessage('Please enter the correct wallet address');
      }
      if(errorMessage != ''){
        document.getElementById('my_modal').showModal();
      }
    }
  }

  return (
    <div>
      <div className="w-4/5 mx-auto sm:w-1/2">
        <div className="flex items-center relative mt-4 sm:mt-10">
          <span className="pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 text-neutral-500 dark:text-neutral-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </span>
          <input
            id="inputSearch"
            type="text"
            placeholder="Search address"
            className="outline-none border-2 py-2 pl-10 pr-4 text-sm border-sky-200 shadow-[2px_2px_0px_1px_#E99F4C] rounded-md focus:border-[#E99F4C] focus:shadow-[1px_2px_0px_0px_#E99F4C] transition-transform transform focus:translate-y-[4px] w-[70%] sm:w-[85%] text-left"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-blue-200 rounded-lg font-bold text-base py-3 w-[80px] sm:w-[133px] shadow-[2px_2px_0px_0px_#E99F4C] transition-transform 
        transform focus:translate-y-[4px] focus:shadow-[1px_2px_0px_0px_#E99F4C] hover:opacity-90 ml-5" onClick={Search}>
            search
          </button>
        </div>

        <div className="flex mt-4 justify-between">
          <div className="text-2xl text-orange-600">
            {tickName}
          </div>

          <div>
            <div className="mt-1">{progress + '%'}</div>
          </div>
        </div>

        <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-600 mt-2">
          <div className="h-1 bg-green-500  rounded-2xl" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="relative overflow-x-auto dark:bg-neutral-700 mt-2 p-10 rounded-2xl  border-2 h-[70vh] flex flex-col border-sky-100 shadow-[2px_2px_0px_1px_#E99F4C] whitespace-nowrap">
          <div className="absolute top-4 right-4 flex items-center">
            {/* <input
              placeholder="Enter Amt"
              onChange={(e) => setMintAmt(e.target.value)}
              className="outline-none border-2 border-[#264143] shadow-[2px_2px_0px_1px_#E99F4C] w-[120px] sm:w-[120px] p-3 rounded-md text-base focus:border-[#E99F4C] focus:shadow-[1px_2px_0px_0px_#E99F4C] transition-transform transform focus:translate-y-[4px]"
              type="number"
              step="any"
              min="0"
            /> */}
            <button className="bg-blue-200 rounded-lg font-bold text-base py-3 w-[80px] sm:w-[150px] shadow-[2px_2px_0px_0px_#E99F4C] transition-transform 
            transform focus:translate-y-[4px] focus:shadow-[1px_2px_0px_0px_#E99F4C] hover:opacity-90 ml-5" onClick={Mint}>
              {mint}
            </button>
          </div>
          <div className=' text-zinc-500 mt-10 '>
            Supply: <a className="text-gray-900">{totalSupply}</a>
          </div>
          <div className='mt-3 text-zinc-500'>
            Minted:  <a className="text-gray-900">{minted}</a>
          </div>
          <div className='mt-3 text-zinc-500'>
            Limit Per Mint:  <a className="text-gray-900">{LimitPerMint}</a>
          </div>
          <div className='mt-3 text-zinc-500'>
            Decimal:  <a className="text-gray-900">{decimal}</a>
          </div>
          <div className='mt-3 text-zinc-500'>
            Holders:  <a className="text-gray-900">{holders}</a>
          </div>
          <div className='mt-3 text-zinc-500 whitespace-nowrap'>
            Deploy By:  <a className="text-gray-900">{deploy}</a>
          </div>
          <div className='mt-3 text-zinc-500'>
            Max Mint:  <a className="text-gray-900">{maxMint}</a>
          </div>
          <div className='mt-3 text-zinc-500'>
            Mint Price:  <a className="text-gray-900">{mintPrice} $ETH</a>
            <div className="relative group inline-flex ml-2 items-center">
              <span className="flex items-center justify-center w-5 h-5 border border-gray-400 rounded-full text-gray-900 cursor-pointer">
                !
              </span>

              <div className="absolute bottom-full mb-2 transform -translate-x-1/2 w-max px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                The inscription deployer get 90%ETH, and the platform 10% service fee!
              </div>
            </div>
          </div>
          <div className='mt-3 text-zinc-500 flex items-center'>
            Reserve:  <a className="text-gray-900">{reserve}</a>
            <div className="relative group inline-flex ml-2 items-center">
              <span className="flex items-center justify-center w-5 h-5 border border-gray-400 rounded-full text-gray-900 cursor-pointer">
                !
              </span>

              <div className="absolute bottom-full mb-2 transform -translate-x-1/2 w-max px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Reserved by the deployer and sent to the deployer address!
              </div>
            </div>
          </div>
          <div className='mt-3 text-zinc-500 mb-2 whitespace-nowrap'>
            Deploy Time:  <a className="text-gray-900">{deployTime}</a>
          </div>
          <div className='text-zinc-500 mt-auto flex items-center relative text-base z-10 flex-wrap'>
            Your Balance: <a className="text-gray-900 ml-2">{balance}</a>
            <button className="bg-blue-200 rounded-lg font-bold text-base py-3 w-[80px] sm:w-[150px] shadow-[2px_2px_0px_0px_#E99F4C] transition-transform transform
             focus:translate-y-[4px] focus:shadow-[1px_2px_0px_0px_#E99F4C] hover:opacity-90 ml-auto -mr-6" onClick={handleOpen}>
              Transfer
            </button>
            {isOpen && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <div className="flex flex-col items-center border-2 border-sky-100 rounded-2xl h-[450px] sm:h-[500px] w-[260px] sm:w-[400px] shadow-[2px_2px_0px_1px_#E99F4C] p-10 bg-white">
                  <p className="text-[#264143] font-bold text-2xl sm:mt-5">Transfer {tickName}</p>
                  <form action="">
                    <div className="flex flex-col items-baseline mb-4">
                      <label className="font-semibold mt-2">Tick</label>
                      <input
                        placeholder="Enter Tick"
                        value={tick}
                        onChange={(e) => setTick(e.target.value)}
                        className="outline-none border-2 border-sky-200 shadow-[2px_2px_0px_1px_#E99F4C] w-[200px] sm:w-[290px] p-3 rounded-md text-sm focus:border-[#E99F4C] focus:shadow-[1px_2px_0px_0px_#E99F4C] transition-transform transform focus:translate-y-[4px]"
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col items-baseline mb-4">
                      <label className="font-semibold mt-2">Receive Address</label>
                      <input
                        placeholder="Enter Receive Address"
                        value={receiveAddress}
                        onChange={(e) => setReceiveAddress(e.target.value)}
                        className="outline-none border-2 border-sky-200 shadow-[2px_2px_0px_1px_#E99F4C] w-[200px] sm:w-[290px] p-3 rounded-md text-sm focus:border-[#E99F4C] focus:shadow-[1px_2px_0px_0px_#E99F4C] transition-transform transform focus:translate-y-[4px]"
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col items-baseline mb-4">
                      <label className="font-semibold mt-2">Amt</label>
                      <input
                        placeholder="Enter Amt"
                        value={amt}
                        onChange={(e) => setAmt(e.target.value)}
                        className="outline-none border-2 border-sky-200 shadow-[2px_2px_0px_1px_#E99F4C] w-[200px] sm:w-[290px] p-3 rounded-md text-sm focus:border-[#E99F4C] focus:shadow-[1px_2px_0px_0px_#E99F4C] transition-transform transform focus:translate-y-[4px]"
                        type="number"
                      />
                    </div>
                    <div className="">
                      <button
                        className="bg-blue-200 rounded-lg font-bold text-base py-3 mb-6 w-[93px] sm:w-[140px] shadow-[2px_2px_0px_0px_#E99F4C] transition-transform transform focus:translate-y-[4px] focus:shadow-[1px_2px_0px_0px_#E99F4C] hover:opacity-90"
                        onClick={handleTransfer}
                        type="button"
                      >
                        {Transfer}
                      </button>
                      <button
                        className="bg-blue-200 rounded-lg font-bold text-base py-3 mb-6 w-[93px] sm:w-[140px] shadow-[2px_2px_0px_0px_#E99F4C] transition-transform transform focus:translate-y-[4px] focus:shadow-[1px_2px_0px_0px_#E99F4C] hover:opacity-90 ml-3"
                        onClick={setIsOpenIsFalse}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
      <div>
        <dialog id="my_modal" className="modal-box text-center">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            <p>{errorMessage}</p>
          </form>
        </dialog>
      </div>
    </div >


  );
};

export default DetailsPage;
