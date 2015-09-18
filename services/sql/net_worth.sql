SELECT performance.val - loans.val AS net_worth 
FROM 
	(SELECT sum(invested + roi) AS val FROM performance WHERE holder = 'logan') AS performance, 
	(SELECT sum(outstanding) AS val FROM loans) AS loans