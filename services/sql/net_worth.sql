SELECT performance.val as capital_investments, loans.val as loans_outstanding, espp.val as espp_escrow, hsa.val as hsa, performance.val - loans.val + hsa.val + espp.val AS net_worth 
FROM 
	(SELECT trunc(sum(invested + roi),2) as val FROM performance WHERE holder = 'logan') AS performance, 
	(SELECT trunc(sum(outstanding),2) as val FROM loans) AS loans,
	(SELECT trunc(sum(amount),2) as val FROM cashflow WHERE account ='hsa') AS hsa,
	(SELECT trunc(sum(amount),2) as val FROM cashflow WHERE account ='espp') AS espp