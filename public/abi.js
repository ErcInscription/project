export const contract = "0x82D47fCE81F937Cd142a714f806181aEbcA2E30E";
export const url = "https://eth.llamarpc.com";
export const abi =[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "allowances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "tick",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "to",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "amt",
				"type": "string"
			}
		],
		"name": "approveData",
		"outputs": [
			{
				"internalType": "string",
				"name": "json",
				"type": "string"
			},
			{
				"internalType": "bytes",
				"name": "jsonHex",
				"type": "bytes"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "balances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "tick",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "max",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "lim",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "maxMint",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "mintPrice",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "reserve",
				"type": "string"
			}
		],
		"name": "depyoyData",
		"outputs": [
			{
				"internalType": "string",
				"name": "json",
				"type": "string"
			},
			{
				"internalType": "bytes",
				"name": "jsonHex",
				"type": "bytes"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "inscriptions",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "maxSupply",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "mintLimit",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "minted",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "deployer",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "deployTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "holders",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxMintPerAddress",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "mintPrice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "reserve",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "mintCounts",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "tick",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "amt",
				"type": "string"
			}
		],
		"name": "mintData",
		"outputs": [
			{
				"internalType": "string",
				"name": "json",
				"type": "string"
			},
			{
				"internalType": "bytes",
				"name": "jsonHex",
				"type": "bytes"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tokenNames",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalTickers",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "tick",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "to",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "amt",
				"type": "string"
			}
		],
		"name": "transferData",
		"outputs": [
			{
				"internalType": "string",
				"name": "json",
				"type": "string"
			},
			{
				"internalType": "bytes",
				"name": "jsonHex",
				"type": "bytes"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "tick",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "to",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "amt",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "from",
				"type": "string"
			}
		],
		"name": "transferFromData",
		"outputs": [
			{
				"internalType": "string",
				"name": "json",
				"type": "string"
			},
			{
				"internalType": "bytes",
				"name": "jsonHex",
				"type": "bytes"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "withdrawERC20",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "withdrawETH",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]