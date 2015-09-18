SELECT holder, array_to_string(array_agg(type),'|') as types
FROM
	(SELECT
		holder,
		type
	FROM performance
	GROUP BY 1,2
	ORDER BY 1,2) subqy
GROUP BY 1
ORDER BY 1,2