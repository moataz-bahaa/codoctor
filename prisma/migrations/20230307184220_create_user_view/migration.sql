-- This is an empty migration.

create view User as
select
	id, email, password, concat(firstName, ' ', lastName) as name, 'doctor' as role 
from Doctor
union
select
	id, email, password, concat(firstName, ' ', lastName) as name, 'patient' as role
from Patient
union
select
	id, email, password, name, 'admin' as role 
from Admin;