SELECT
	holder,
	type,
	round(sum(coalesce(stkp.cost_basis-stkp.revenue,0))+min(per.cost_basis),2) as cost_basis,
	round(per.current_value,2) as current_value,
	round(sum(coalesce(stkp.revenue-stkp.cost_basis,0))+min(per.roi),2) as roi
FROM
        (
	SELECT
		holder, 
		type,
		sum(cost_basis*shares) as cost_basis,
		sum(current_price*shares) as current_value,
		sum(roi) as roi	
	FROM performance
	GROUP BY 1,2
	) per
LEFT JOIN stock_performance stkp
USING (holder, type)
GROUP BY 1,2,4
ORDER BY holder, type
;