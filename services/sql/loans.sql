(SELECT 
	upper(acct) as account,
	round(sum(original),2) as principle,
	round(sum(outstanding),2) as outstanding,
	round(rate * 100,2) || '%' as rate
FROM loans
WHERE outstanding > 0
GROUP BY 1,4
)UNION(
SELECT 
	'TOTAL' as account,
	round(sum(original),2) as principle,
	round(sum(outstanding),2) as outstanding,
	round(sum((outstanding/ttl_out)*rate*100),2)||'%' as rate
FROM loans
CROSS JOIN (select sum(outstanding) ttl_out from loans) subqy
WHERE outstanding > 0
)
ORDER BY outstanding