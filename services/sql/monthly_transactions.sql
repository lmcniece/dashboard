SELECT
	account,
	CASE
		WHEN type = 'debit'
			THEN amount * -1
		ELSE amount
	END as amount,
	type,
	date
FROM transactions
WHERE date_part('year',date)= '${year}$'
	and date_part('month',date) = '${month}$'
ORDER BY date desc