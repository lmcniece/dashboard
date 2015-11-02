WITH cashflows AS(
SELECT
	coalesce(prior.tag,current.tag) as account,
	coalesce(prior.amount,0) as fy14,
	coalesce(current.amount,0) as fy15,
	round(coalesce(prior.amount,0)*(EXTRACT(DOY FROM current_timestamp)::numeric/365),2) as fy14_pr,
	round(coalesce(current.amount,0) - coalesce(prior.amount,0)*(EXTRACT(DOY FROM current_timestamp)::numeric/365),2) as delta
FROM
	cashflow_current_year CURRENT
FULL JOIN cashflow_prior_year prior USING (tag)
WHERE coalesce(prior.type,current.type) = 'credit'
ORDER BY delta DESC
),

agg_cashflow AS(
(SELECT *,row_number() OVER() as index FROM cashflows)
UNION
(SELECT
	'total' as account,
	sum(coalesce(prior.amount,0)) as fy14,
	sum(coalesce(current.amount,0)) as fy15,
	round(sum(coalesce(prior.amount,0)*(EXTRACT(DOY FROM current_timestamp)::numeric/365)),2) as fy14_pr,
	round(sum(coalesce(current.amount,0) - coalesce(prior.amount,0)*(EXTRACT(DOY FROM current_timestamp)::numeric/365)),2) as delta,
	'1000' as index
FROM
	cashflow_current_year CURRENT
FULL JOIN cashflow_prior_year prior USING (tag)
WHERE coalesce(prior.type,current.type) = 'credit'
)
)

SELECT * FROM agg_cashflow ORDER BY INDEX ASC