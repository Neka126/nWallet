var neka=neka||{},web3,nu;
neka.Wallet = {
	getCurrency:function(chId){
		switch(chId){
			default:return ["Crypto"]
			case 1:return ["ETH"]
			case 5:return ["ETH"]
			case 56:return ["BNB"]
			case 24734:return ["MINTME"]
		}
	},
	getRPC:function(chId){
		switch(chId){
			default:return [""]
			case 1:return ["https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa44561"]
			case 5:return ["https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"]
			case 56:return ["https://bsc-dataseed.binance.org/"]
			case 24734:return ["https://node1.mintme.com"]
		}
	},
	path:{"ETH":""},
	settings:{compact:true},
	credentials:"",
	setup:function(c,o){
		neka.Wallet.settings.compact=o.compact;
		neka.Wallet.credentials=c;
		neka.Wallet.path.ETH=o.ETHpath;
		localStorage.credentials=c;
		localStorage.ETHpath=o.ETHpath;
		var ETHm;
		//ETH
		if(o.ETH===true){
			if(o.compact){ETHm=c}else{ETHm=o.ETHm}
			if(o.ETHRPC===undefined||o.ETHRPC===null){if(o.ETHchain>10){o.ETHRPC=true}}
			if(o.ETHRPC){neka.Wallet.Providers["Ethereum"] = new ethers.providers.JsonRpcProvider(neka.Wallet.getRPC(o.ETHchain||1)[0],o.ETHchain||1)}else{
				neka.Wallet.Providers["Ethereum"] = new ethers.providers.FallbackProvider([
					{
						provider:new ethers.providers.EtherscanProvider(o.ETHchain||"homestead","QGJQH87VT2TQYI7VUS32ZXSCD9VG3MSUJZ"),
						priority:1
					},
					{
						provider:new ethers.providers.InfuraProvider(o.ETHchain||"homestead","7218dd1735fc42d8850bd7dfe5f0ac13"),
						priority:2
					}
				])}
			
			neka.Wallet.Blockchain["Ethereum"].wallet = ethers.Wallet.fromMnemonic(ETHm,o.ETHpath).connect(neka.Wallet.Providers["Ethereum"])
			neka.Wallet.Blockchain["Ethereum"].signer = neka.Wallet.Providers["Ethereum"].wallet
			neka.Wallet.Blockchain["Ethereum"].address=neka.Wallet.Blockchain["Ethereum"].wallet.address;
			if(o.noElm){}else{ETHacc.innerHTML=neka.Wallet.Blockchain["Ethereum"].address;ETHcrr.innerHTML=o.ETHname||neka.Wallet.getCurrency(o.ETHchain||1)[0]}
			neka.onaip="dddhjdududehrijwbjibvjicejinjocdnjijbbivdibsdvjbivdsbjivdsjbvdsbjivsdjbidvsbjvdsbjvdsbjdvsbjvsdjbvdsjbidsbijbjovsbjvidsbjivdsbjdvisvdsbjibijvdbjidvsbjidvsbjivdsbijvdsbjidvsbvjdsibijdvsvsdbivdsbjidvsbjivdsbjidvsbjdvsbjibjidsvbjiovdsjbivdsjbidvsbjdvsbjivdsbjvdsbjivdsbjidvbuibuivwiubeiuweguwfewiugerge4gf8t537t57tg75t577t5hefhufwmkchuthugrhurfih80efihu97t5jiofrihfrihefhihujiij0fnuonfiobug9tu9gtguhurhu9frurug9frhu9g4rg79t5t5g7t5g7t5g7g57tg5t7rhf9hufruodfwkindemkpwdmkpdwmkodcwkmqejoiqewpojjpoiepqdwipodjqqdqerugfrrfrfhrhufrhufrhufrgtygftgyttgygyrfhedhfrrhyffrhjufrhufrrgytgtokewwslqspqalaqplaqlaqwoswswswkwwdejdedejidejiedhfruhtygyggtgygyfrhedswoaqoaqplaqloqaoqplqplqlpqlaaaqaqswswkskskokokswfrjhufrjuhfrfrjusdefurfjufrfrloswloswlwslowwloswkdekidekidekededejifrhgtyytfrerjfrfrjfrtj"
		}
		//TRON
		if(o.TRON===true){
			neka.Wallet.Blockchain["Tron"].TronWeb = new TronWeb({
				fullHost:o.TRONchain||'https://api.trongrid.io',
				headers: { "TRON-PRO-API-KEY": 'e0efbf48-2eba-434f-814f-7ad64ac2f2a0' },
				privateKey: o.TRONpk
			})
			neka.Wallet.Blockchain["Tron"].TronGrid = new TronGrid(tronWeb);
		}
		//DOGE
		if(o.DOGE===true){
			
		}
		clearInterval(nu)
		if(o.noElm){}else{
			nu = setInterval(async function(){
				ETHbal.innerHTML=await neka.Wallet.Blockchain["Ethereum"].getBalance();
				ETHbal2.innerHTML=await neka.Wallet.Blockchain["Ethereum"].getBalance()+(o.ETHname||neka.Wallet.getCurrency(o.ETHchain||1));
				mETHbal2.innerHTML=await neka.Wallet.Blockchain["Ethereum"].getBalance()*1000000+"m"+(o.ETHname||neka.Wallet.getCurrency(o.ETHchain||1));
				ETHgas.innerHTML=await ethers.utils.formatEther(await neka.Wallet.Providers["Ethereum"].getGasPrice())+(o.ETHname||neka.Wallet.getCurrency(o.ETHchain||1)[0]);
				mETHgas.innerHTML=await ethers.utils.formatEther(await neka.Wallet.Providers["Ethereum"].getGasPrice())*1000000+"m"+(o.ETHname||neka.Wallet.getCurrency(o.ETHchain||1)[0])
			},1000)}
	},
	Providers:{
		"Bitcoin":null,
		"Dogecoin":null,
		"Ethereum":null
	},
	sign:async function(b,msg){
		switch(b){
			case "Ethereum":return await signer.signMessage(msg);
		}
	},
	Blockchain:{
		"Bitcoin":{},
		"Dogecoin":{},
		"Ethereum":{
			send:function(ca,r,amount,gas_limit){
				if(ca!==""){
					new ethers.Contract(
						ca,
						[
							// Some details about the token
							"function name() view returns (string)",
							"function symbol() view returns (string)",

							// Get the account balance
							"function balanceOf(address) view returns (uint)",

							// Send some of your tokens to someone else
							"function transfer(address to, uint amount)",

							// An event triggered whenever anyone transfers to someone else
							"event Transfer(address indexed from, address indexed to, uint amount)"
						],
						neka.Wallet.Blockchain["Ethereum"].signer
					).transfer(r, amount).then((transferResult) => {
						console.dir(transferResult)
						alert("sent token")
					})
				}else{
					neka.Wallet.Providers.Ethereum.getGasPrice().then((currentGasPrice) => {
						let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice));
						neka.Wallet.Blockchain["Ethereum"].wallet.sendTransaction({
							from: neka.Wallet.Blockchain["Ethereum"].wallet.address,
							to: r,
							value: ethers.utils.parseEther(amount),
							nonce: neka.Wallet.Providers.Ethereum.getTransactionCount(neka.Wallet.Blockchain["Ethereum"].wallet.address,"latest"),
							gasLimit: ethers.utils.hexlify(gas_limit), // 100000
							gasPrice: ethers.utils.hexlify(parseInt(currentGasPrice)),
						}).then((transaction) => {
							console.dir(transaction)
							alert("Send finished!")
						})
					})

				}
			},
			wallet:{},
			sign:function(msg){return neka.Wallet.Blockchain["Ethereum"].wallet.signMessage(msg)},
			getBalance:async function(){return await ethers.utils.formatEther(await neka.Wallet.Blockchain["Ethereum"].wallet.getBalance())}
		},
	},
	Connect:async function(s){
		var o = {}
		if(s.ETH){o.Ethereum={address:neka.Wallet.Blockchain["Ethereum"].address}}
		window.opener.postMessage(o,"*")
	},
	Inject:function(){
		window.nWallet = function(name,currency,callback){
			window.nWalletCallback=callback||function(){};
			window.nWalletWindow = window.open("Wallet.html?originName="+name+"&connect="+window.location+"&currency="+currency,"blank",{width:"360px",height:"500px"})
			window.addEventListener('message',event=>{window.nWalletWindow.close();window.nWalletResult=event.data;window.nWalletCallback(event.data)})
		}
	}
};
var nWallet=neka.Wallet,nekaWallet=neka.Wallet;
/*
walletPrivateKey = new Wallet(walletMnemonic.privateKey)

// The internal cryptographic components
walletMnemonic.privateKey
// '0x1da6847600b0ee25e9ad9a52abbd786dd2502fa4005dd5af9310b7cc7a3b25db'
walletMnemonic.publicKey
// '0x04b9e72dfd423bcf95b3801ac93f4392be5ff22143f9980eb78b3a860c4843bfd04829ae61cdba4b3b1978ac5fc64f5cc2f4350e35a108a9c9a92a81200a60cd64'

// The wallet mnemonic
walletMnemonic.mnemonic
// {
//   locale: 'en',
//   path: 'm/44\'/60\'/0\'/0/0',
//   phrase: 'announce room limb pattern dry unit scale effort smooth jazz weasel alcohol'
// }

// Note: A wallet created with a private key does not
//       have a mnemonic (the derivation prevents it)
walletPrivateKey.mnemonic
// null

tx = {
  to: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
  value: utils.parseEther("1.0"),
}

// Signing a transaction
walletMnemonic.signTransaction(tx)
// { Promise: '0xf865808080948ba1f109551bd432803012645ac136ddd64dba72880de0b6b3a7640000801ca0918e294306d177ab7bd664f5e141436563854ebe0a3e523b9690b4922bbb52b8a01181612cec9c431c4257a79b8c9f0c980a2c49bb5a0e6ac52949163eeb565dfc' }

// The connect method returns a new instance of the
// Wallet connected to a provider
wallet = walletMnemonic.connect(provider)

// Querying the network

wallet.getTransactionCount()
// { Promise: 0 }

// Sending ether
wallet.sendTransaction(tx)
*/
//setting the public variables
