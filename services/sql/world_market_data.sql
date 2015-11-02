WITH max_diff AS(
    select max(change_perc) from stock_info where symbol like '^%'
),
min_diff AS(
    select min(change_perc) from stock_info where symbol like '^%'
)

SELECT display as country,
	CASE
		WHEN max > 2 AND change_perc > 0
			THEN round(change_perc * (1-(max-2)/max),2)
		WHEN min < 2 AND change_perc < 0
			THEN round(change_perc * (1-(min+2)/min),2)
		ELSE round(change_perc,2)
	END as change_perc, change_perc as label
FROM stock_info
CROSS JOIN max_diff
CROSS JOIN min_diff
WHERE symbol like '^%'