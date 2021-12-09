
# It will check if docker is not installed, if not it will install it.
docker -v
if [ "$?" = "127" ]
then
sudo apt-get update
sudo apt-get install docker
sudo apt-get install docker-compose

else
    echo "Docker is already installed"
fi

# after getting the docker-ce, check if `redislabs/redisgraph` docker image is not installed then install ii. 
if [ -z "$(docker images -q redislabs/redisgraph:latest)" ]
then
    echo "Docker already have a redislabs/redisgraph:latest image"

else 
    docker run -p 6379:6379 -it --rm redislabs/redisgraph:latest
fi

# Command to run the Redis directly 
# sudo docker run -p 6379:6379 -it --rm redislabs/redisgraph:latest
