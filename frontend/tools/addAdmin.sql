INSERT INTO user
	(id, email, name, password, createdAt, updatedAt, profileUrl, role, resetPasswordToken, verfiedAt)
	VALUES (2000, 'admin@example.com', 'admin', '$2b$10$ysTGtcTpyvThShsjY/mFDuLwDHL0aQIi1CdYmVFWtr/atbPklzWWG', NOW(), NOW(), '', 'ADMIN', '', NOW())