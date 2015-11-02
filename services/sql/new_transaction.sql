INSERT INTO transactions (account, amount, type, date) values (
	lower('${account}$'),
	'${amount}$',
	lower('${type}$'),
	'${date}$'
)