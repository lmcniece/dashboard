SELECT * FROM
(SELECT round(amount,2) as bank FROM cashflow WHERE account = 'bank') bank
CROSS JOIN
(SELECT round(amount,2) as payroll FROM cashflow WHERE account = 'payroll') payroll