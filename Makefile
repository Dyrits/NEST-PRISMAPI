database:
	docker compose up -d
	npx prisma generate
	npx prisma migrate dev --name init
