## Hydra Agent GUI
This is a GUI for the [Hydra Ecosystem's Agent](https://github.com/HTTP-APIs/hydra-python-agent). It's divided in two parts: the left side shows the Hydra API as a linked graph and at the right you have a generic console built based on the API Documentation  that you can use to query the API. The Frontend was built with React, a middle layer to use the Agent was built with Flask.

![Agent GUI Picture](/console-frontend/src/assets/images/agent_gui.png)

### Installing Requirements
It's recommended that you use venv(virtual environment):

```
sudo apt-get install python3-venv # If not installed
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
```

### Running Redis Graph 
The Agent uses a Redis local server as a caching layer. That said, it's necessary that you run Redis Graph locally:

```
sudo ./redis_setup.sh # <- Might be necessary to uso sudo
```

### Running the GUI
If you've installed the Requirements and have the proper Redis running you can simply:
```
python3 app.py
```

**Now open your browser and enjoy at:** [http://localhost:3000/](http://localhost:3000/ "http://localhost:3000/")

### Contributing to the GUI

This repository is divided in two parts, the Middle-Layer/Backend with Flask under ```app.py``` and the React project under the folder ```console-frontend```. 

**The Flask Backend** is built to communicate with the Python Agent package. It declares five endpoints which are used for this:

- **send-command** - Send Commands to Agent and returns the server response
- **/hydra-doc** - Simply serves the Hydra Doc 
- **apidoc-graph** - Fetches Hydra Doc from the Agent, process it in Vis.js Network format and returns it to the GUI
- **/start-agent** - Simply starts/restarts the Agent with the URL parameter 
- **/** - Serves the React build under /console-frontend/build

**The React Frontend**

Go the the README.md inside ```console-frontend``` for further information. If you make modifications inside ```console-frontend```, make sure to run ```npm run build``` to create a updated production build. 
