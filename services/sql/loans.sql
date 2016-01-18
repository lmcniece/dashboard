WITH total AS(
	select 'TOTAL' as account, sum(outstanding) as ttl_out from loans where outstanding > 0
)

(SELECT 
	upper(acct) as account,
	round(original,2) as principle,
	round(outstanding,2) as outstanding,
	round(rate * 100,2) || '%' as rate
FROM loans
WHERE outstanding > 0
)UNION(
SELECT 
	'TOTAL' as account,
	round(sum(original),2) as principle,
	round(sum(outstanding),2) as outstanding,
	round(sum((outstanding/ttl_out)*rate*100),2)||'%' as rate
FROM loans
CROSS JOIN (select ttl_out from total) subqy
WHERE outstanding > 0
)
ORDER BY outstanding