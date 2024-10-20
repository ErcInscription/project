"use client"
import { useEffect, useState, useRef } from "react";
import { ethers, Log } from "ethers";
import { abi } from "../public/abi";
import { contract } from "../public/abi";
import { ThreeDots } from 'react-loader-spinner';
import { url } from "/public/abi";

export default function erc20() {
  const [data, setData] = useState([]);
  let tokenList = [];
  const hasFetched = useRef(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [initialData, setInitialData] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const wallet = ethers.Wallet.createRandom();
        const provider = new ethers.JsonRpcProvider(url);
        const signer = wallet.connect(provider);
        const thisContract = new ethers.Contract(contract, abi, signer);
        let listLength = await thisContract.totalTickers();
        const tokenPromises = [];
        for (let i = 0; i < listLength; i++) {
          const tokenPromise = (async () => {
            let tokenName = await thisContract.tokenNames(i);
            let result = await thisContract.inscriptions(tokenName);
            let array = result.toString().split(',');

            return {
              tickName: tokenName,
              deployTime: new Date(array[5] * 1000).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
              progress: (((array[3] / 10 ** 18) / (array[1] / 10 ** 18)) * 100).toFixed(2),
              holders: array[6],
              totalSupply: (BigInt(array[1]) / BigInt(10 ** 18)).toString()
            };
          })();
          tokenPromises.push(tokenPromise);
        }

        Promise.all(tokenPromises)
          .then(tokenList => {
            setInitialData(tokenList);
            setData(tokenList);
          })
          .catch(error => {
            console.error('error:', error);
          });


      } catch (error) {
        console.error("Error fetching token data:", error);
      }
    };

    if (!hasFetched.current) {
      fetchData();
      hasFetched.current = true;
    }
  }, []);

  useEffect(() => {
    // Fuzzy search when searchTerm changes
    const results = initialData.filter(item =>
      item.tickName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setData(results); // Update the data to match the results
  }, [searchTerm, initialData]);

  const handleRowClick = (item) => {
    window.location.href = `/pages/Token?tick=${item.tickName}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-60">
        <ThreeDots color="#00BFFF" height={80} width={80} />
      </div>
    );
  }

  return (
    <div className="w-4/5 mx-auto sm:w-1/2">
      <div class="overflow-x-auto  dark:bg-neutral-700 mt-10 p-10 rounded-2xl border-sky-100  shadow-[2px_2px_0px_1px_#E99F4C] border-2">

        <div class="relative m-[2px] mb-3 mr-5 float-left">
          {/* <label for="inputSearch" class="sr-only">Search </label> */}

          <input
            id="inputSearch"
            type="text"
            placeholder="Search..."
            className="outline-none border-2 py-2 pl-10 pr-4 text-sm border-sky-200 shadow-[2px_2px_0px_1px_#E99F4C] w-64 rounded-md  focus:border-[#E99F4C] focus:shadow-[1px_2px_0px_0px_#E99F4C] transition-transform transform focus:translate-y-[4px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 text-neutral-500 dark:text-neutral-200">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </span>
        </div>

        {/* <div class="relative m-[2px] mb-3 float-right hidden sm:block">
          <label for="inputFilter" class="sr-only">Filter</label>
          <select id="inputFilter" class="block w-40 rounded-lg border dark:border-none dark:bg-neutral-600 p-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400">
            <option value="1" selected>Last week</option>
            <option value="2">Last month</option>
            <option value="3">Yesterday</option>
            <option value="4">Last 7 days</option>
            <option value="5">Last 30 days</option>
          </select>
        </div> */}

        <table class="min-w-full text-left text-sm whitespace-nowrap">

          <thead class="tracking-wider border-b-2 dark:border-neutral-600">
            <tr>
              <th scope="col" class="px-6 py-4">
                Tick
              </th>
              <th scope="col" class="px-6 py-4">
                Deploy Time
                {/* Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. */}

                {/* <a href="" class="inline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                    class="w-[0.75rem] h-[0.75rem] inline ml-1 text-neutral-500 dark:text-neutral-200 mb-[1px]"
                    fill="currentColor"
                  >
                    <path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" />
                  </svg>
                </a> */}
              </th>
              <th scope="col" class="px-6 py-4">
                Progress
                {/* Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. */}
                {/* <a href="" class="inline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                    class="w-[0.75rem] h-[0.75rem] inline ml-1 text-neutral-500 dark:text-neutral-200 mb-[1px]"
                    fill="currentColor"
                  >
                    <path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" />
                  </svg>
                </a> */}

              </th>
              <th scope="col" class="px-6 py-4">
                Holders
                {/* Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. */}
                {/* <a href="" class="inline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                    class="w-[0.75rem] h-[0.75rem] inline ml-1 text-neutral-500 dark:text-neutral-200 mb-[1px]"
                    fill="currentColor"
                  >
                    <path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" />
                  </svg>
                </a> */}

              </th>
              <th scope="col" class="px-6 py-4">
                Total Supply
                {/* Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. */}
                {/* <a href="" class="inline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                    class="w-[0.75rem] h-[0.75rem] inline ml-1 text-neutral-500 dark:text-neutral-200 mb-[1px]"
                    fill="currentColor"
                  >
                    <path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" />
                  </svg>
                </a> */}

              </th>

            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-b dark:border-neutral-600 hover:bg-blue-100 dark:hover:bg-neutral-600 cursor-pointer h-full w-full"
                onClick={() => handleRowClick(item)}
              >
                <th scope="row" className="px-6 py-4 select-none">
                  {item.tickName}
                </th>
                <td className="px-6 py-4 select-none">
                  {item.deployTime}
                </td>
                <td className="px-6 py-4 select-none">
                  <div className="mt-2">{item.progress + '%'}</div>
                  <div className="mb-6 h-1 w-full bg-neutral-200 dark:bg-neutral-600">
                    <div className="h-1 bg-green-500  rounded-2xl" style={{ width: `${item.progress}%` }}></div>
                  </div>
                </td>
                <td className="px-6 py-4 select-none">
                  {item.holders}
                </td>
                <td className="px-6 py-4 ">
                  {item.totalSupply}
                </td>
                {/* </Link> */}
              </tr>
            ))}
          </tbody>

        </table>

        {/* <nav class="mt-5 flex items-center justify-between text-sm" aria-label="Page navigation example">

          <ul class="list-style-none flex mx-auto">
            <li>
              <a
                class="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
                href="#!"
              >
                Previous
              </a>
            </li>
          
            <li>
              <a
                class="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
                href="#!"
              >
                Next
              </a>
            </li>
          </ul>
        </nav> */}

      </div>
      <div className="gap-2.5 flex flex-row fixed bottom-0 right-0 m-4 z-10">
        <a href="https://x.com/Erc_Inscription" target="_blank" rel="noopener noreferrer">
          <img className="w-[50px] hover:scale-110 transition-transform duration-300" src="/logo-x.bb4e36e.svg" alt="Twitter" />
        </a>
        <a  target="_blank" rel="noopener noreferrer">
          <img className="w-[50px] hover:scale-110 transition-transform duration-300" src="/logo-discord.b1ab28c.svg" alt="Discord" />
        </a>
        <a  target="_blank" rel="noopener noreferrer">
          <img className="w-[50px] hover:scale-110 transition-transform duration-300" src="/logo-telegram.bfc6843.svg" alt="Telegram" />
        </a>
      </div>
    </div>


  )
}