// help.js

module.exports = async(args, message,) => {
	if(!args[1] == 'help'){
		await message.reply('Wow');
	}
	await message.reply(
		'Smart Utang'+
		'Command `oi help`: untuk mengetahui command & argument.'+
		' '+
		'Create Utang: `oi [user1] utang [user 2] [amount]` : `user1` utang ke `user2` sebesar `amount`'+
		'Bayar Utang: `oi [user1] bayar [user2] [amount]` : `user1` bayar utang ke `user2` sebesar `amount`'+
		'List Utang: `oi list utang [user1]` : lihat utang `user1` ke siapa aja'+
		'*List Uang: `oi list uang [user1]` : lihat uang `user1` di siapa aja, dan total saldo pada bunker'+
		'Generate Utang: `oi all utang [user1] [amount]` : melakukan patungan dengan `amount` yang akan dibagi rata, bot akan membagikan ke semua user termasuk `user1`'+
		'Merge Utang: `oi merge [user1] [user2] [user3] [amount]`: merge utang, mindahin utangnya `user2` ke `user1`. Jadi `user1` utang langsung ke `user3`. Gambaran awal `user1>user2>user3` jadi `user1>user3` dengan `amount` yang ditentukan pada argument.'+
		' '+
		'*sedang tahap development'
	);
}

/* 
'Smart Utang'+
'Command `oi help`: untuk mengetahui command & argument.'+
' '+
'Create Utang: `oi [user1] utang [user 2] [amount]` : `user1` utang ke `user2` sebesar `amount`'+
'Bayar Utang: `oi [user1] bayar [user2] [amount]` : `user1` bayar utang ke `user2` sebesar `amount`'+
'List Utang: `oi list utang [user1]` : lihat utang `user1` ke siapa aja'+
'*List Uang: `oi list uang [user1]` : lihat uang `user1` di siapa aja, dan total saldo pada bunker'+
'Generate Utang: `oi all utang [user1] [amount]` : melakukan patungan dengan `amount` yang akan dibagi rata, bot akan membagikan ke semua user termasuk `user1`'+
'Merge Utang: `oi merge [user1] [user2] [user3] [amount]`: merge utang, mindahin utangnya `user2` ke `user1`. Jadi `user1` utang langsung ke `user3`. Gambaran awal `user1>user2>user3` jadi `user1>user3` dengan `amount` yang ditentukan pada argument.'+
' '+
'*sedang tahap development'
*/
