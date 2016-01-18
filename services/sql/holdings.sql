WITH holdings AS(
	SELECT
		upper(symbol) as symbol,
		round(shares,2) as shares,
		round(invested,2) as invested,
		round(shares * current_price,2) as value,
		round(dividends,2) as dividends,
		round(roi,2) as roi,
		round(roi_perc,2) as roi_perc,
		round(cost_basis,2) as basis,
		round(current_price,2) as price,
		round(change,2) as change,
		round(change_perc,2) as change_perc,
		date_trunc('second', last_updated) - INTERVAL '5 hours 15 minutes' as last_updated
	FROM performance
	WHERE type = '${type}$' and holder = '${holder}$'
	ORDER BY change desc
),
unification as(
	(SELECT *,row_number() OVER() as index FROM holdings)
	UNION
	(SELECT
		'TOTAL'::text as symbol,
		null as shares,
		sum(invested) as invested,
		sum(value) as value,
		sum(dividends) as value,
		sum(roi) as roi,
		round(((sum(value)-sum(invested))/sum(invested))*100,2) as roi_perc,
		null as basis,
		null as price,
		sum(change) as change,
		round(sum(change)/sum(value)*100,2) as change_perc,
		null as last_updated,
		99 as index
	FROM holdings
	)
)

SELECT symbol, shares, invested, value, dividends, roi, roi_perc, basis, price, change, change_perc, last_updated
FROM unification
ORDER BY index