;var event = {
	clientList:[],
	listen:function(key,fn){
		if (!this.clientList[key]) {
			this.clientList[key] = [];
		}
		this.clientList[key].push(fn)
	},
	trigger:function(){
		var key = Array.prototype.shift.call(arguments),
			fns = this.clientList[key];
		if (!fns || fns.length === 0) return false;
		for (var i =0,fn;fn=fns[i++];) {
			fn.apply(this,arguments)
		}

	}
}
function installEvent(obj){
	for(var i in event){
		obj[i] = event[i]
	}
}
var sales = {};
installEvent(sales);
sales.listen("customerIn",function(){
	console.log("1");
})
sales.trigger('customerIn')
console.log(sales)