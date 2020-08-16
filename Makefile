init:
	docker-compose build
build:
	docker-compose up cdk-build
bash:
	docker-compose up -d cdk-tty
	docker-compose exec cdk-tty bash
	docker-compose stop cdk-tty

# command in docker container
d-build:
	npm run build
	cdk synth
d-deploy:
	make d-build
	cdk bootstrap
	cdk deploy -f
