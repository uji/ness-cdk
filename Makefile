SHELL=bash

HAS_DOCKER := $(shell\
	if type "docker" > /dev/null 2>&1; then\
			echo true;\
		else\
			echo false;\
	fi\
)

# commands for host with docker command
ifeq ($(HAS_DOCKER),true)
init:
	docker volume create ness-cdk
	docker-compose build

clean:
	docker volume remove ness-cdk

up:
	docker-compose up -d
	docker-compose exec cdk sh init.sh

down:
	docker-compose down

start:
	docker-compose start

stop:
	docker-compose stop

build:
	docker-compose exec cdk make build

deploy:
	docker-compose exec cdk make deploy

bash:
	docker-compose exec cdk bash

appbin:
	rm -rf tmp
	mkdir tmp
	curl -s https://api.github.com/repos/uji/ness-api-function/releases/latest \
	| grep "browser_download_url.*_Linux_x86_64.tar.gz" \
	| cut -d : -f 2,3 \
	| tr -d \" \
	| xargs curl -o tmp/ness-api-function-bin.tar.gz -L
	tar -zxvf tmp/ness-api-function-bin.tar.gz -C tmp
	mkdir -p appbin/ness-api-function
	mv tmp/ness-api-function appbin/ness-api-function
	rm -rf tmp
endif

# command in docker container
ifeq ($(HAS_DOCKER),false)
build:
	npm run build
	cdk synth

deploy:
	cdk bootstrap
	cdk deploy --require-approval never

destroy:
	cdk destroy
endif
