INSERT INTO transactions (account, amount, type, date, category) values (
	lower('${account}$'),
	'${amount}$',
	lower('${type}$'),
	'${date}$',
	lower('${category}$')
)