SELECT
	upper(account) as account,
	round(amount,2) as amount,
	due_day
FROM bills
ORDER BY due_day ASC