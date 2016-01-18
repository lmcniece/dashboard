WITH cashflows AS(
SELECT
	coalesce(prior.tag,current.tag) as account,
	coalesce(prior.amount,0) as prior,
	coalesce(current.amount,0) as current,
	round(coalesce(prior.amount,0)*(EXTRACT(DOY FROM current_timestamp)::numeric/365),2) as pro_rated,
	round(coalesce(current.amount,0) - coalesce(prior.amount,0)*(EXTRACT(DOY FROM current_timestamp)::numeric/365),2) as delta
FROM
	revenue_current_year CURRENT
FULL JOIN revenue_prior_year prior USING (tag)
ORDER BY delta DESC
),

agg_cashflow AS(
(SELECT *,row_number() OVER() as index FROM cashflows)
UNION
(SELECT
	'total' as account,
	sum(coalesce(prior.amount,0)) as prior,
	sum(coalesce(current.amount,0)) as current,
	round(sum(coalesce(prior.amount,0)*(EXTRACT(DOY FROM current_timestamp)::numeric/365)),2) as pro_rated,
	round(sum(coalesce(current.amount,0) - coalesce(prior.amount,0)*(EXTRACT(DOY FROM current_timestamp)::numeric/365)),2) as delta,
	'1000' as index
FROM
	revenue_current_year CURRENT
FULL JOIN revenue_prior_year prior USING (tag)
)
)

SELECT account, prior, current, pro_rated, delta FROM agg_cashflow ORDER BY INDEX ASC