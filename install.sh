#!/bin/bash
mkdir -p ./gateway/certs
cd ./gateway/certs
mkcert shortening.local.com "*.shortening.local.com"

#TODO: Load and update hosts dynamically from docker-compose file
declare -a hosts=("182.39.0.53 shortening.local.com" "182.39.0.52 shortening.database.local.com" "182.39.0.203 shortening.cache.local.com" "182.39.0.172 shortening.api.local.com")

# get number of hosts
numberOfHosts=${#hosts[@]}

# use for loop to read all values and indexes
for (( i = 0; i < ${numberOfHosts}; i++ ));
do
  if ! grep -q "${hosts[$i]}" /etc/hosts; then
    echo "${hosts[$i]}" | sudo tee -a /etc/hosts > /dev/null
  fi
done

docker-compose up -d --build