# Check super user privilige
if [[ $(id -u) -ne 0 ]]; then
echo "Run with superuser priviliges"
exit
fi

# It will check if docker is not installed, if not it will install it.
docker -v
if [ "$?" = "127" ]; then
    # Check if pacman is installed
    which pacman
    arch=$?
    # Check if apt-get is installed
    which apt-get
    deb=$?
    if [[ $arch -eq 0 ]]; then
        sudo pacman -Syy
        sudo pacman -S docker docker-compose
    elif [[ $deb -eq 0 ]]; then
        sudo apt-get update
        sudo apt-get docker docker-compose
    fi
else
    echo "Docker is already installed"
fi

# after getting the docker-ce, check if `redislabs/redisgraph` docker image is not installed then install ii.
if [ -z "$(docker images -q redislabs/redisgraph:latest)" ]
then
    echo "Docker already have a redislabs/redisgraph:latest image"

else
    sudo docker run -p 6379:6379 -it --rm redislabs/redisgraph:latest
fi

# Command to run the Redis directly
# sudo docker run -p 6379:6379 -it --rm redislabs/redisgraph:latest
