WITH expenses AS(
SELECT
	coalesce(prior.category,current.category) as account,
	coalesce(prior.amount,0) as prior,
	coalesce(current.amount,0) as current,
	round(coalesce(prior.amount,0)*(EXTRACT(DOY FROM current_timestamp)::numeric/365),2) as pro_rated,
	round(coalesce(prior.amount,0)*(EXTRACT(DOY FROM current_timestamp)::numeric/365)-coalesce(current.amount,0),2) as delta
FROM
	expenses_current_year CURRENT
FULL JOIN expenses_prior_year prior USING (category)
ORDER BY delta DESC
),

agg_expenses AS(
(SELECT *,row_number() OVER() as index FROM expenses)
UNION
(SELECT
	'total' as account,
	sum(coalesce(prior.amount,0)) as prior,
	sum(coalesce(current.amount,0)) as current,
	round(sum(coalesce(prior.amount,0)*(EXTRACT(DOY FROM current_timestamp)::numeric/365)),2) as pro_rated,
	round(sum(coalesce(prior.amount,0)*(EXTRACT(DOY FROM current_timestamp)::numeric/365)-coalesce(current.amount,0)),2) as delta,
	'1000' as index
FROM
	expenses_current_year CURRENT
FULL JOIN expenses_prior_year prior USING (category)
)
)

SELECT account, prior, current, pro_rated, delta FROM agg_expenses ORDER BY INDEX ASC