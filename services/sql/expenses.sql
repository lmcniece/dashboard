WITH variable_categories AS(
SELECT unnest(string_to_array('drinking,dining,entertainment,furnish,grocery,electronics,misc,clothing,laundry',','))
),

cashflows AS(
SELECT
	tag,
	coalesce(ce.amount,0) as expected,
	coalesce(ca.amount,0) as actual,
	coalesce(ca.amount,0) - coalesce(ce.amount,0) as delta
FROM cashflow_expected ce
FULL JOIN (
	select * 
	from expenses_actual
	where year = '${year}$'
		and month = '${month}$'
		and tag in (select * from variable_categories)
	) ca
USING (tag)
WHERE tag in (select * from variable_categories)
ORDER BY delta desc
),

agg_cashflow AS(
(SELECT *,row_number() OVER() as index FROM cashflows)
UNION
(SELECT
	'total'::text as tag,
	sum(coalesce(ce.amount,0)) as expected,
	sum(coalesce(ca.amount,0)) as actual,
	sum(coalesce(ca.amount,0) - coalesce(ce.amount,0)) as delta,
	'1000' as index
FROM cashflow_expected ce
FULL JOIN (
	select * 
	from expenses_actual
	where year = '${year}$'
		and month = '${month}$'
	) ca USING (tag)
WHERE tag in (select * from variable_categories)
)
)

SELECT tag, expected, actual, delta FROM agg_cashflow ORDER BY INDEX ASC