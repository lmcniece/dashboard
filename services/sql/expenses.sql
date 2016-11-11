WITH static_categories AS(
SELECT unnest(string_to_array('payroll,401k,espp,internet,loan,medical,rent,tax,transport,travel,utilities',','))
),

cashflows AS(
SELECT
	category,
	coalesce(ce.amount,0) as expected,
	coalesce(ca.amount,0) as actual,
	coalesce(ce.amount,0) - coalesce(ca.amount,0) as delta
FROM cashflow_expected ce
FULL JOIN (
	select * 
	from expenses_actual
	where year = '${year}$'
		and month = '${month}$'
		and category not in (select * from static_categories)
	) ca
USING (category)
WHERE category not in (select * from static_categories)
ORDER BY delta desc
),

agg_cashflow AS(
(SELECT *,row_number() OVER() as index FROM cashflows)
UNION
(SELECT
	'total'::text as tag,
	sum(coalesce(ce.amount,0)) as expected,
	sum(coalesce(ca.amount,0)) as actual,
	sum(coalesce(ce.amount,0) - coalesce(ca.amount,0)) as delta,
	'1000' as index
FROM cashflow_expected ce
FULL JOIN (
	select * 
	from expenses_actual
	where year = '${year}$'
		and month = '${month}$'
	) ca USING (category)
WHERE category not in (select * from static_categories)
)
)

SELECT category, expected, actual, delta FROM agg_cashflow ORDER BY INDEX ASC