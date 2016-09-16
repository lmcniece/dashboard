SELECT trunc(performance.val - loans.val + hsa.val + 1000,2) AS net_worth 
FROM 
	(SELECT sum(invested + roi) as val FROM performance WHERE holder = 'logan') AS performance, 
	(SELECT sum(outstanding) as val FROM loans) AS loans,
	(SELECT amount as val FROM cashflow WHERE account = 'hsa') AS hsa