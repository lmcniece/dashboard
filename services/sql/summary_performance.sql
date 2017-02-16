SELECT
	holder,
	type,
	round(coalesce(his.cost_basis,0)+per.cost_basis-coalesce(div.amount,0),2) as cost_basis,
	round(per.current_value,2) as current_value,
	round(coalesce(div.amount,0) + per.current_value-(coalesce(his.cost_basis,0)+per.cost_basis),2) as roi
FROM
    (
	SELECT
		holder, 
		type,
		sum(cost_basis*shares) as cost_basis,
		sum(current_price*shares) as current_value
	FROM performance
	GROUP BY 1,2
	) per
LEFT JOIN (select type, holder, sum(cost_basis)-sum(revenue) as cost_basis from stock_performance group by 1,2) his USING (type, holder)
LEFT JOIN (select type, holder, sum(amount) as amount from dividends group by 1,2) div USING (type, holder)
ORDER BY holder, type
;