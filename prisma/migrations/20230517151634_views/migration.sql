CREATE VIEW users AS
SELECT id,
  email,
  password,
  firstName,
  midName,
  lastName,
  'doctor' as role
FROM doctors
UNION
SELECT id,
  email,
  password,
  firstName,
  midName,
  lastName,
  'patient' as role
FROM patients
UNION
SELECT id,
  email,
  password,
  firstName,
  midName,
  lastName,
  'admin' as role
FROM admins;

-- 

CREATE VIEW doctors_view AS 
SELECT d.id AS id,
  firstName,
  midName,
  lastName,
  m.title AS medicalSpecialization,
  avg(r.rate) AS rate
FROM doctors AS d
  LEFT JOIN doctors_reviews AS r ON r.doctorId = d.id
  JOIN medical_specializations AS m ON m.id = d.medicalSpecializationId
GROUP BY d.id;