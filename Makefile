build:
	docker-compose build
up:
	docker-compose up -d
	sleep 3
	docker logs gpsd
down:
	docker-compose down