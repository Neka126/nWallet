window.nWallet = function(name,currency,callback){
	window.nWalletCallback=callback||function(){};
	window.nWalletWindow = window.open("Wallet.html?originName="+name+"&connect="+window.location+"&currency="+currency,"blank",{width:"360px",height:"500px"})
	window.addEventListener('message',event=>{window.nWalletWindow.close();window.nWalletResult=event.data;window.nWalletCallback(event.data)})
}